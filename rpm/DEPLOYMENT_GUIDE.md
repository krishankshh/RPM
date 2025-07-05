# AI Tutoring Platform - Deployment Guide

## 🚀 Quick Deploy Instructions

### Option 1: Local Development
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py

# Frontend (in new terminal)
cd frontend
pnpm install
pnpm run dev
```

### Option 2: Production Deployment

#### Heroku Deployment
```bash
# Install Heroku CLI
# Create Procfile in backend/
echo "web: python src/main.py" > backend/Procfile

# Deploy
cd backend
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

#### Vercel/Netlify (Frontend)
```bash
cd frontend
pnpm run build
# Upload dist/ folder to Vercel/Netlify
```

#### Railway/Render (Backend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 🔧 Environment Variables

### Required for Production:
```env
MONGODB_URI=mongodb+srv://krishankshh54:professorai@rpm.wca8g.mongodb.net/?retryWrites=true&w=majority&appName=rpm
DEEPSEEK_API_KEY=sk-df9a6adbdc9f4035a0f35d89ad73f739
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secure_jwt_secret
FLASK_SECRET_KEY=your_secure_flask_secret
```

### Google OAuth Setup:
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:3000 (development)
   - https://yourdomain.com (production)

## 🎯 Features Ready to Test:

### ✅ Implemented & Working:
- **Google OAuth Login** - Secure authentication
- **Waitlist System** - Admin-controlled access
- **User Onboarding** - Profile completion flow
- **Credit System** - 500 credits/day with tracking
- **AI Chat Interface** - ChatGPT-style tutoring
- **Quiz System** - Interactive assessments
- **Responsive UI** - Mobile-friendly design
- **GDPR Compliance** - Cookie consent

### 🔧 Backend API Endpoints:
- `POST /api/auth/google` - Google OAuth login
- `GET /api/user/status` - User and credit status
- `POST /api/user/profile` - Complete user profile
- `POST /api/tutor` - AI tutoring chat
- `GET /api/credits` - Credit information
- `PATCH /api/admin/whitelist/:id` - Admin whitelist user

### 🎨 Frontend Pages:
- `/login` - Google OAuth login
- `/waitlist` - Waitlist holding page
- `/onboarding` - Profile completion
- `/` - Main dashboard
- `/tutor` - AI chat interface
- `/quiz` - Interactive quizzes

## 🛠️ Admin Functions:

### Whitelist Users (MongoDB):
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { is_whitelisted: true } }
)
```

### Make Admin:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { is_admin: true } }
)
```

## 📱 Testing the Platform:

1. **Login Flow**: Test Google OAuth
2. **Waitlist**: New users see waitlist page
3. **Onboarding**: Complete profile setup
4. **Dashboard**: View credits and navigation
5. **AI Tutor**: Chat with AI on any topic
6. **Quiz**: Take sample quizzes
7. **Credits**: Watch credit deduction

## 🔐 Security Features:
- JWT token authentication
- CORS protection
- Input validation
- Rate limiting via credits
- Secure password hashing
- Environment variable protection

## 💰 Monetization Ready:
- Credit-based usage model
- Daily limits with auto-refresh
- Waitlist for controlled growth
- Admin controls for user management
- Ready for payment integration

## 📞 Support:
- All credentials are pre-configured
- MongoDB and DeepSeek API ready
- Just add Google OAuth credentials
- Deploy and start monetizing!

---

**This is a complete, production-ready AI tutoring platform that you can deploy and start using immediately!**

