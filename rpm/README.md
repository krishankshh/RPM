# AI Tutoring Platform MVP

A production-ready AI tutoring platform with MongoDB, Google OAuth, DeepSeek AI integration, and credit-based monetization.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- DeepSeek API key

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Run Development
**Backend:**
```bash
cd backend
source venv/bin/activate
python src/main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🏗️ Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
cp -r dist/* ../backend/src/static/
```

### Deploy Backend
```bash
cd backend
source venv/bin/activate
python src/main.py
```

## 📊 Features

### ✅ Implemented
- **MongoDB Integration** - User data, sessions, credits
- **Google OAuth** - Secure authentication
- **DeepSeek AI** - Real AI tutoring responses
- **Credit System** - 500 credits/day, 1 credit = 75 tokens
- **Waitlist System** - Admin-controlled access
- **JWT Authentication** - Secure API access
- **Prompt Templates** - Tutor, Quiz, Feedback templates
- **Session Management** - Persistent chat sessions

### 🔄 Ready to Implement
- **File Upload** - PDF/Image processing with OCR
- **Vector Search** - FAISS integration for RAG
- **Quiz Generation** - AI-powered assessments
- **Admin Dashboard** - User management interface
- **Payment Integration** - Credit purchasing

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
DEEPSEEK_API_KEY=your_deepseek_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

### Credit System
- Daily limit: 500 credits
- Token ratio: 75 tokens = 1 credit
- Auto-reset: Every 24 hours
- Continuation: Sessions continue even after credits exhausted

## 📁 Project Structure
```
ai-tutoring-pro/
├── backend/
│   ├── src/
│   │   ├── main.py          # Flask application
│   │   ├── config.py        # Configuration management
│   │   ├── database.py      # MongoDB models
│   │   ├── ai_service.py    # DeepSeek integration
│   │   └── static/          # Frontend build files
│   ├── prompts/             # AI prompt templates
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/                 # React application
│   ├── package.json         # Node dependencies
│   └── dist/                # Build output
└── README.md
```

## 🔐 Security Features
- JWT token authentication
- MongoDB connection security
- CORS protection
- Input validation
- Rate limiting via credits

## 📈 Monetization
- Credit-based usage model
- Daily limits with refresh
- Waitlist for controlled access
- Admin controls for user management

## 🛠️ Development Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python src/main.py

# Update requirements
pip freeze > requirements.txt
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## 🚀 Deployment Options

### 1. Heroku
```bash
# Backend deployment
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### 2. Vercel/Netlify (Frontend)
```bash
npm run build
# Deploy dist/ folder
```

### 3. VPS/Cloud
```bash
# Install dependencies
# Configure environment
# Run with process manager (PM2, systemd)
```

## 📞 Support

### Common Issues
1. **MongoDB Connection**: Check connection string and network access
2. **Google OAuth**: Verify client ID/secret and redirect URLs
3. **DeepSeek API**: Confirm API key and rate limits
4. **CORS Errors**: Check frontend/backend URL configuration

### Admin Functions
```bash
# Whitelist user (requires admin access)
curl -X PATCH http://localhost:5000/api/admin/whitelist/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 📄 License
Commercial license - All rights reserved

## 🤝 Contributing
This is a commercial product. Contact for collaboration opportunities.

