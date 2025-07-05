# 🤖 AI Tutoring Platform - Production-Ready MVP

> **AI Agent Guidance**: This is a commercial AI tutoring platform designed for monetization. The goal is to create a ChatGPT-like tutoring experience with credit-based usage, waitlist management, and professional UI/UX.

## 🎯 **PROJECT GOALS & VISION**

### Primary Objective
Build a **production-ready AI tutoring platform** that can be immediately deployed and monetized, featuring:
- **ChatGPT-style conversational tutoring** on any academic subject
- **Credit-based monetization** (500 credits/day, 1 credit = 75 tokens)
- **Waitlist system** for controlled user onboarding
- **Professional UI/UX** similar to Manus platform aesthetics
- **Google OAuth authentication** for seamless user experience

### Target Market
- Students (K-12, University, Professional)
- Educational institutions
- Individual learners seeking personalized AI tutoring

### Revenue Model
- **Freemium**: 500 daily credits (refreshes every 24h)
- **Premium tiers**: Additional credit packages (future implementation)
- **Institutional licenses**: Bulk access for schools (future implementation)

## 🏗️ **ARCHITECTURE OVERVIEW**

### Tech Stack
```
Frontend: React 19 + Tailwind CSS + shadcn/ui
Backend: Flask + MongoDB Atlas
AI: DeepSeek API (cost-effective alternative to OpenAI)
Auth: Google OAuth + JWT tokens
Deployment: Production-ready for Heroku/Vercel/Railway
```

### Core Components
1. **Authentication System** - Google OAuth with JWT
2. **Credit Management** - Daily limits with auto-refresh
3. **AI Tutoring Engine** - DeepSeek integration with prompt templates
4. **Waitlist Management** - Admin-controlled user access
5. **Session Management** - Persistent chat conversations
6. **Admin Dashboard** - User management and analytics

## 🚀 **QUICK START FOR AI AGENTS**

### Understanding the Codebase
```bash
rpm/
├── backend/                 # Flask API server
│   ├── src/
│   │   ├── main.py         # Main Flask application
│   │   ├── config.py       # Environment configuration
│   │   ├── database.py     # MongoDB models and operations
│   │   ├── ai_service.py   # DeepSeek AI integration
│   │   └── static/         # Built frontend files
│   ├── prompts/            # AI prompt templates
│   ├── .env               # Environment variables
│   └── requirements.txt   # Python dependencies
├── frontend/              # React application
│   ├── src/                 # React application source
│   │   ├── components/    # UI components
│   │   ├── api.js        # Backend API integration
│   │   └── firebase.js   # Google OAuth config
│   └── package.json      # Node dependencies
└── README.md             # This file
```

### Key Files to Understand
- **`backend/src/main.py`** - All API endpoints and business logic
- **`backend/src/database.py`** - MongoDB operations and data models
- **`frontend/src/App.jsx`** - Main React app with routing
- **`frontend/src/components/TutorPage.jsx`** - Core tutoring interface

### Environment Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
pnpm install
pnpm run build
cp -r dist/* ../backend/src/static/
```

## 🎯 **AI AGENT DEVELOPMENT GUIDELINES**

### When Working on This Project:

#### 1. **Understand the Business Model**
- This is a **commercial product** designed for immediate monetization
- Focus on **user experience** and **reliability** over experimental features
- **Credit system is core** - every AI interaction costs credits
- **Waitlist management** controls growth and server costs

#### 2. **Code Quality Standards**
- **Production-ready code only** - no experimental or incomplete features
- **Error handling** is critical - users are paying customers
- **Security first** - JWT tokens, input validation, rate limiting
- **Mobile-responsive** - users access from all devices

#### 3. **Feature Priority Order**
1. **Core tutoring functionality** (highest priority)
2. **Credit system reliability**
3. **User authentication and security**
4. **Admin management tools**
5. **UI/UX improvements**
6. **Additional features** (lowest priority)

#### 4. **Development Approach**
- **Test locally first** - always verify changes work before deployment
- **Incremental improvements** - small, tested changes over large rewrites
- **Backward compatibility** - don't break existing user data
- **Documentation** - update this README when adding features

### 🔧 **COMMON TASKS FOR AI AGENTS**

#### Adding New Features
```bash
# 1. Understand the existing code structure
# 2. Add backend API endpoint in main.py
# 3. Update database models in database.py if needed
# 4. Create/update frontend components
# 5. Test the complete flow
# 6. Update documentation
```

#### Fixing Bugs
```bash
# 1. Reproduce the issue locally
# 2. Check logs and error messages
# 3. Fix the root cause, not just symptoms
# 4. Test the fix thoroughly
# 5. Ensure no regression in other features
```

#### UI/UX Improvements
```bash
# 1. Focus on mobile-first design
# 2. Maintain consistency with existing design
# 3. Use shadcn/ui components when possible
# 4. Test on multiple screen sizes
# 5. Ensure accessibility standards
```

## 📊 **CURRENT STATUS & FEATURES**

### ✅ **Implemented & Working**
- [x] Google OAuth authentication
- [x] User registration and profile completion
- [x] Waitlist system with admin controls
- [x] Credit system (500/day with auto-refresh)
- [x] AI tutoring chat interface
- [x] Session persistence
- [x] JWT token security
- [x] MongoDB integration
- [x] DeepSeek AI integration
- [x] Responsive UI with Tailwind CSS
- [x] GDPR-compliant cookie consent

### 🔄 **Ready for Implementation**
- [ ] Payment integration (Stripe/PayPal)
- [ ] File upload and OCR processing
- [ ] Vector search with FAISS
- [ ] Quiz generation system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Usage analytics
- [ ] API rate limiting
- [ ] Caching layer

### 🎯 **Future Enhancements**
- [ ] Multi-language support
- [ ] Voice chat integration
- [ ] Mobile app (React Native)
- [ ] Institutional dashboards
- [ ] Advanced analytics
- [ ] Custom AI models

## 🔐 **SECURITY & COMPLIANCE**

### Security Measures
- JWT token authentication
- MongoDB connection security
- CORS protection
- Input validation and sanitization
- Rate limiting via credit system
- Environment variable protection

### Privacy Compliance
- GDPR cookie consent
- User data encryption
- Secure session management
- Privacy policy integration
- Data retention policies

## 💰 **MONETIZATION STRATEGY**

### Current Model
- **Free Tier**: 500 credits/day (auto-refresh)
- **Credit Deduction**: 1 credit = 75 AI tokens
- **Waitlist Control**: Manage server costs and user experience

### Revenue Opportunities
1. **Premium Subscriptions**: More daily credits
2. **One-time Credit Purchases**: Immediate credit top-ups
3. **Institutional Licenses**: Bulk access for schools
4. **API Access**: Third-party integrations
5. **White-label Solutions**: Custom deployments

## 🚀 **DEPLOYMENT INSTRUCTIONS**

### Environment Variables Required
```env
MONGODB_URI=mongodb+srv://...
DEEPSEEK_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
FLASK_SECRET_KEY=...
FLASK_ENV=production
CORS_ORIGINS=*
```

### Production Deployment
```bash
# Build frontend
cd frontend && pnpm run build
cp -r dist/* ../backend/src/static/

# Deploy backend (choose one)
# Heroku: git push heroku main
# Railway: Connect GitHub repo
# Vercel: Deploy backend as serverless function
```

### Local Testing
```bash
# Start backend
cd backend && source venv/bin/activate && python src/main.py

# Access at http://localhost:5000
```

## 🤝 **AI AGENT COLLABORATION GUIDELINES**

### Before Making Changes
1. **Read this entire README** to understand the project goals
2. **Test the current application** to understand user flow
3. **Review existing code** to understand patterns and conventions
4. **Check the issue tracker** for known problems or planned features

### While Developing
1. **Follow existing code patterns** and naming conventions
2. **Write production-ready code** with proper error handling
3. **Test thoroughly** before committing changes
4. **Document new features** in this README

### After Implementation
1. **Update this README** with new features or changes
2. **Test the complete user journey** from login to tutoring
3. **Verify deployment works** on the target platform
4. **Document any new environment variables** or setup steps

## 📞 **SUPPORT & TROUBLESHOOTING**

### Common Issues
1. **MongoDB Connection**: Check URI and network access
2. **Google OAuth**: Verify client ID/secret and redirect URLs
3. **DeepSeek API**: Confirm API key and rate limits
4. **CORS Errors**: Check frontend/backend URL configuration
5. **Credit System**: Verify MongoDB credit calculations

### Debug Commands
```bash
# Check backend logs
cd backend && python src/main.py

# Test API endpoints
curl http://localhost:5000/api/health

# Check MongoDB connection
python -c "from src.database import client; print(client.server_info())"
```

### Getting Help
- Check the deployment logs for error messages
- Verify all environment variables are set correctly
- Test each component (auth, credits, AI) individually
- Review the browser console for frontend errors

## 📄 **LICENSE & USAGE**

This is a **commercial project** designed for monetization. The code is provided for:
- Educational purposes
- Commercial deployment by the repository owner
- Collaboration with authorized AI agents and developers

**Not permitted**: Unauthorized commercial use, redistribution, or competing implementations.

---

## 🎯 **QUICK REFERENCE FOR AI AGENTS**

### Project Type: **Commercial AI Tutoring Platform**
### Goal: **Production-ready, monetizable ChatGPT-like tutoring**
### Priority: **Reliability > Features**
### User Base: **Paying customers (credit-based)**
### Development Style: **Incremental, tested improvements**

**Remember**: This is a real business application. Every change should enhance user experience and platform reliability. Focus on production-ready code that can handle real users and real money transactions.


