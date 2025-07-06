from pymongo import MongoClient
from datetime import datetime, timedelta
import bcrypt
import jwt
from bson import ObjectId
from src.config import get_config

config = get_config()

# MongoDB Connection
client = MongoClient(config.MONGODB_URI)
db = client['ai_tutoring_platform']  # Specify database name

# Collections
users_collection = db.users
sessions_collection = db.sessions
uploads_collection = db.uploads
credits_collection = db.credits

class User:
    @staticmethod
    def create_user(google_id, email, name, picture=None):
        """Create a new user from Google OAuth"""
        user_data = {
            'google_id': google_id,
            'email': email,
            'name': name,
            'picture': picture,
            'academic_level': None,
            'subject_interest': None,
            'learning_goals': None,
            'is_whitelisted': False,  # Default to waitlist
            'is_admin': False,
            'created_at': datetime.utcnow(),
            'last_login': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_data)
        
        # Create initial credit account
        Credits.create_credit_account(str(result.inserted_id))
        
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_google_id(google_id):
        """Find user by Google ID"""
        return users_collection.find_one({'google_id': google_id})
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by MongoDB ObjectId"""
        return users_collection.find_one({'_id': ObjectId(user_id)})
    
    @staticmethod
    def update_profile(user_id, academic_level, subject_interest, learning_goals):
        """Update user profile after registration"""
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'academic_level': academic_level,
                    'subject_interest': subject_interest,
                    'learning_goals': learning_goals,
                    'profile_completed': True,
                    'updated_at': datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def whitelist_user(user_id):
        """Admin function to whitelist a user"""
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'is_whitelisted': True,
                    'whitelisted_at': datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def update_last_login(user_id):
        """Update user's last login timestamp"""
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'last_login': datetime.utcnow()}}
        )
    
    @staticmethod
    def create_manual_user(email, password, name, phone=None):
        """Create a new user with email/password"""
        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return None
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'phone': phone,
            'academic_level': None,
            'subject_interest': None,
            'learning_goals': None,
            'is_whitelisted': False,  # Default to waitlist
            'is_admin': False,
            'created_at': datetime.utcnow(),
            'last_login': datetime.utcnow(),
            'profile_completed': False
        }
        
        result = users_collection.insert_one(user_data)
        
        # Create initial credit account
        Credits.create_credit_account(str(result.inserted_id))
        
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        return users_collection.find_one({'email': email})
    
    @staticmethod
    def verify_password(email, password):
        """Verify user password"""
        user = User.find_by_email(email)
        if not user or 'password' not in user:
            return None
        
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return user
        return None
    
    @staticmethod
    def list_users(page=1, limit=50, filter_type='all'):
        """List users with pagination and filtering"""
        skip = (page - 1) * limit
        
        # Build filter query
        query = {}
        if filter_type == 'waitlist':
            query['is_whitelisted'] = False
        elif filter_type == 'whitelisted':
            query['is_whitelisted'] = True
        
        # Get total count
        total = users_collection.count_documents(query)
        
        # Get users
        users = list(users_collection.find(
            query,
            {
                'password': 0,  # Exclude password from results
                'google_id': 0  # Exclude sensitive data
            }
        ).sort('created_at', -1).skip(skip).limit(limit))
        
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
            if 'created_at' in user:
                user['created_at'] = user['created_at'].isoformat()
            if 'whitelisted_at' in user:
                user['whitelisted_at'] = user['whitelisted_at'].isoformat()
            if 'last_login' in user:
                user['last_login'] = user['last_login'].isoformat()
        
        return {
            'users': users,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }
    
    @staticmethod
    def make_admin(user_id):
        """Make a user an admin"""
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'is_admin': True,
                    'admin_granted_at': datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def get_user_stats():
        """Get user statistics for admin dashboard"""
        total_users = users_collection.count_documents({})
        waitlisted_users = users_collection.count_documents({'is_whitelisted': False})
        whitelisted_users = users_collection.count_documents({'is_whitelisted': True})
        admin_users = users_collection.count_documents({'is_admin': True})
        
        # Get recent registrations (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_registrations = users_collection.count_documents({
            'created_at': {'$gte': week_ago}
        })
        
        return {
            'total_users': total_users,
            'waitlisted_users': waitlisted_users,
            'whitelisted_users': whitelisted_users,
            'admin_users': admin_users,
            'recent_registrations': recent_registrations
        }
    
    @staticmethod
    def bulk_whitelist(user_ids):
        """Bulk whitelist multiple users"""
        object_ids = [ObjectId(user_id) for user_id in user_ids]
        return users_collection.update_many(
            {'_id': {'$in': object_ids}},
            {
                '$set': {
                    'is_whitelisted': True,
                    'whitelisted_at': datetime.utcnow()
                }
            }
        )

class Credits:
    @staticmethod
    def create_credit_account(user_id):
        """Create initial credit account for new user"""
        credit_data = {
            'user_id': user_id,
            'daily_credits': config.DAILY_CREDIT_LIMIT,
            'credits_used_today': 0,
            'last_reset': datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0),
            'total_credits_used': 0,
            'created_at': datetime.utcnow()
        }
        return credits_collection.insert_one(credit_data)
    
    @staticmethod
    def get_credit_status(user_id):
        """Get current credit status for user"""
        credit_account = credits_collection.find_one({'user_id': user_id})
        
        if not credit_account:
            # Create account if it doesn't exist
            Credits.create_credit_account(user_id)
            credit_account = credits_collection.find_one({'user_id': user_id})
        
        # Check if we need to reset daily credits
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        if credit_account['last_reset'] < today:
            credits_collection.update_one(
                {'user_id': user_id},
                {
                    '$set': {
                        'credits_used_today': 0,
                        'last_reset': today
                    }
                }
            )
            credit_account['credits_used_today'] = 0
        
        remaining_credits = config.DAILY_CREDIT_LIMIT - credit_account['credits_used_today']
        next_reset = today + timedelta(days=1)
        
        return {
            'remaining_credits': max(0, remaining_credits),
            'daily_limit': config.DAILY_CREDIT_LIMIT,
            'used_today': credit_account['credits_used_today'],
            'next_reset': next_reset,
            'total_used': credit_account['total_credits_used']
        }
    
    @staticmethod
    def deduct_credits(user_id, tokens_used):
        """Deduct credits based on tokens used"""
        credits_to_deduct = max(1, tokens_used // config.TOKENS_PER_CREDIT)
        
        result = credits_collection.update_one(
            {'user_id': user_id},
            {
                '$inc': {
                    'credits_used_today': credits_to_deduct,
                    'total_credits_used': credits_to_deduct
                }
            }
        )
        
        return credits_to_deduct if result.modified_count > 0 else 0
    
    @staticmethod
    def can_use_credits(user_id, estimated_tokens):
        """Check if user has enough credits for operation"""
        credit_status = Credits.get_credit_status(user_id)
        estimated_credits = max(1, estimated_tokens // config.TOKENS_PER_CREDIT)
        
        return credit_status['remaining_credits'] >= estimated_credits

class TutoringSession:
    @staticmethod
    def create_session(user_id, topic, content_chunks=None):
        """Create a new tutoring session"""
        session_data = {
            'user_id': user_id,
            'topic': topic,
            'content_chunks': content_chunks or [],
            'messages': [],
            'credits_used': 0,
            'status': 'active',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = sessions_collection.insert_one(session_data)
        return str(result.inserted_id)
    
    @staticmethod
    def add_message(session_id, role, content, tokens_used=0):
        """Add a message to the session"""
        message = {
            'role': role,
            'content': content,
            'tokens_used': tokens_used,
            'timestamp': datetime.utcnow()
        }
        
        return sessions_collection.update_one(
            {'_id': ObjectId(session_id)},
            {
                '$push': {'messages': message},
                '$inc': {'credits_used': max(1, tokens_used // config.TOKENS_PER_CREDIT)},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
    
    @staticmethod
    def get_session(session_id):
        """Get session by ID"""
        return sessions_collection.find_one({'_id': ObjectId(session_id)})
    
    @staticmethod
    def get_user_sessions(user_id, limit=10):
        """Get user's recent sessions"""
        return list(sessions_collection.find(
            {'user_id': user_id}
        ).sort('updated_at', -1).limit(limit))

class Upload:
    @staticmethod
    def create_upload(user_id, filename, file_type, extracted_text, chunks):
        """Create upload record"""
        upload_data = {
            'user_id': user_id,
            'filename': filename,
            'file_type': file_type,
            'extracted_text': extracted_text,
            'chunks': chunks,
            'vector_indexed': False,
            'created_at': datetime.utcnow()
        }
        
        result = uploads_collection.insert_one(upload_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_uploads(user_id):
        """Get user's uploads"""
        return list(uploads_collection.find({'user_id': user_id}).sort('created_at', -1))
    
    @staticmethod
    def mark_indexed(upload_id):
        """Mark upload as vector indexed"""
        return uploads_collection.update_one(
            {'_id': ObjectId(upload_id)},
            {'$set': {'vector_indexed': True}}
        )

def generate_jwt_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm='HS256')

def verify_jwt_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

