import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from functools import wraps
import jwt
from datetime import datetime

from src.config import get_config
from src.database import (
    User, Credits, TutoringSession, Upload,
    generate_jwt_token, verify_jwt_token
)
from src.ai_service import DeepSeekService, load_prompt_template, fill_template

config = get_config()
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = config.SECRET_KEY

# Enable CORS
CORS(app, origins=config.CORS_ORIGINS, supports_credentials=True)

# Initialize AI service
ai_service = DeepSeekService()

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            token = token.replace('Bearer ', '')
            user_id = verify_jwt_token(token)
            if not user_id:
                return jsonify({'error': 'Invalid token'}), 401
            
            request.current_user_id = user_id
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
    
    return decorated_function

def require_whitelist(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = User.find_by_id(request.current_user_id)
        if not user or not user.get('is_whitelisted', False):
            return jsonify({'error': 'Access denied. You are on the waitlist.'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Health check
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AI Tutoring Platform API is running',
        'version': '1.0.0'
    })

# Google OAuth login (simplified - you'll need to implement full OAuth flow)
@app.route('/api/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    google_id = data.get('google_id')
    email = data.get('email')
    name = data.get('name')
    picture = data.get('picture')
    
    if not all([google_id, email, name]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find or create user
    user = User.find_by_google_id(google_id)
    if not user:
        user_id = User.create_user(google_id, email, name, picture)
        user = User.find_by_id(user_id)
    else:
        User.update_last_login(str(user['_id']))
    
    # Generate JWT token
    token = generate_jwt_token(str(user['_id']))
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'picture': user.get('picture'),
            'is_whitelisted': user.get('is_whitelisted', False),
            'profile_completed': user.get('profile_completed', False),
            'is_admin': user.get('is_admin', False)
        }
    })

# Manual user registration
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    academic_level = data.get('academic_level')
    subject_interest = data.get('subject_interest')
    
    if not all([email, password, name, academic_level, subject_interest]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate email format
    import re
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password strength
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    
    # Create user
    user_id = User.create_manual_user(email, password, name, phone)
    if not user_id:
        return jsonify({'error': 'User with this email already exists'}), 409
    
    # Update profile immediately
    User.update_profile(user_id, academic_level, subject_interest, "Improve understanding")
    
    # Get updated user
    user = User.find_by_id(user_id)
    
    # Generate JWT token
    token = generate_jwt_token(user_id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'phone': user.get('phone'),
            'is_whitelisted': user.get('is_whitelisted', False),
            'profile_completed': user.get('profile_completed', False),
            'is_admin': user.get('is_admin', False)
        }
    }), 201

# Manual user login
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Verify user credentials
    user = User.verify_password(email, password)
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Update last login
    User.update_last_login(str(user['_id']))
    
    # Generate JWT token
    token = generate_jwt_token(str(user['_id']))
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'phone': user.get('phone'),
            'is_whitelisted': user.get('is_whitelisted', False),
            'profile_completed': user.get('profile_completed', False),
            'is_admin': user.get('is_admin', False)
        }
    })

# User status check
@app.route('/api/user/status')
@require_auth
def user_status():
    user = User.find_by_id(request.current_user_id)
    credit_status = Credits.get_credit_status(request.current_user_id)
    
    return jsonify({
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'is_whitelisted': user.get('is_whitelisted', False),
            'profile_completed': user.get('profile_completed', False),
            'is_admin': user.get('is_admin', False)
        },
        'credits': credit_status
    })

# Complete user profile
@app.route('/api/user/profile', methods=['POST'])
@require_auth
def complete_profile():
    data = request.get_json()
    academic_level = data.get('academic_level')
    subject_interest = data.get('subject_interest')
    learning_goals = data.get('learning_goals')
    
    if not all([academic_level, subject_interest, learning_goals]):
        return jsonify({'error': 'All fields are required'}), 400
    
    User.update_profile(request.current_user_id, academic_level, subject_interest, learning_goals)
    
    return jsonify({'message': 'Profile completed successfully'})

# Admin: Whitelist user
@app.route('/api/admin/whitelist/<user_id>', methods=['PATCH'])
@require_auth
def whitelist_user(user_id):
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    User.whitelist_user(user_id)
    return jsonify({'message': 'User whitelisted successfully'})

# Admin: Bulk whitelist users
@app.route('/api/admin/bulk-whitelist', methods=['PATCH'])
@require_auth
def bulk_whitelist_users():
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    user_ids = data.get('user_ids', [])
    
    if not user_ids:
        return jsonify({'error': 'No user IDs provided'}), 400
    
    result = User.bulk_whitelist(user_ids)
    return jsonify({
        'message': f'Successfully whitelisted {result.modified_count} users',
        'modified_count': result.modified_count
    })

# Admin: List all users (with pagination)
@app.route('/api/admin/users', methods=['GET'])
@require_auth
def list_users():
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))
    filter_type = request.args.get('filter', 'all')  # all, waitlist, whitelisted
    
    users = User.list_users(page, limit, filter_type)
    return jsonify(users)

# Admin: Make user admin
@app.route('/api/admin/make-admin/<user_id>', methods=['PATCH'])
@require_auth
def make_admin(user_id):
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    User.make_admin(user_id)
    return jsonify({'message': 'User granted admin access successfully'})

# Admin: Get waitlist stats
@app.route('/api/admin/stats', methods=['GET'])
@require_auth
def get_admin_stats():
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    stats = User.get_user_stats()
    return jsonify(stats)

# Tutoring session
@app.route('/api/tutor', methods=['POST'])
@require_auth
@require_whitelist
def tutor_session():
    data = request.get_json()
    message = data.get('message')
    topic = data.get('topic', 'General Learning')
    session_id = data.get('session_id')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Check credits
    if not Credits.can_use_credits(request.current_user_id, 150):  # Estimate
        return jsonify({'error': 'Insufficient credits'}), 402
    
    # Get user info for personalization
    user = User.find_by_id(request.current_user_id)
    
    # Create or get session
    if not session_id:
        session_id = TutoringSession.create_session(request.current_user_id, topic)
    
    # Load and fill prompt template
    template = load_prompt_template('tutor_prompt_template')
    prompt = fill_template(
        template,
        user_level=user.get('academic_level', 'intermediate'),
        subject_interest=user.get('subject_interest', 'general'),
        learning_goals=user.get('learning_goals', 'improve understanding'),
        topic_name=topic,
        retrieved_chunks="No specific content uploaded yet. Use general knowledge."
    )
    
    # Prepare messages for AI
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": message}
    ]
    
    # Get AI response
    response = ai_service.chat_completion(messages)
    
    if 'error' in response:
        return jsonify({'error': 'AI service error'}), 500
    
    # Deduct credits
    Credits.deduct_credits(request.current_user_id, response['tokens_used'])
    
    # Save messages to session
    TutoringSession.add_message(session_id, 'user', message)
    TutoringSession.add_message(session_id, 'assistant', response['content'], response['tokens_used'])
    
    return jsonify({
        'response': response['content'],
        'session_id': session_id,
        'tokens_used': response['tokens_used'],
        'credits_remaining': Credits.get_credit_status(request.current_user_id)['remaining_credits']
    })

# Get credits status
@app.route('/api/credits')
@require_auth
def get_credits():
    credit_status = Credits.get_credit_status(request.current_user_id)
    return jsonify(credit_status)

# Serve frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "Frontend not built", 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = config.FLASK_ENV == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)


# Admin: Delete user
@app.route("/api/admin/users/<user_id>", methods=["DELETE"])
@require_auth
def delete_user_route(user_id):
    # Check if current user is admin
    current_user = User.find_by_id(request.current_user_id)
    if not current_user.get('is_admin', False):
        return jsonify({"error": "Admin access required"}), 403
    
    # Prevent admin from deleting themselves
    if str(request.current_user_id) == user_id:
        return jsonify({"error": "Cannot delete your own admin account"}), 400

    result = User.delete_user(user_id)
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User deleted successfully"}), 200


