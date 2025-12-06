# RideShare - Quick Reference Card

## 🚀 Project Name: **RideShare**

## 📋 Essential Commands

### Installation
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Or install separately
cd frontend && npm install
cd backend && npm install
```

### Development
```bash
# Backend (Terminal 1)
cd backend && npm run dev
# Runs on: http://localhost:3000

# Frontend (Terminal 2)
cd frontend && npm start
# Opens Expo DevTools
```

### Git Commands
```bash
# Set author (if not global)
git config user.name "Awais Akram"
git config user.email "your-email@example.com"

# First commit
git add .
git commit -m "feat: initial project setup"

# Feature branch
git checkout -b feature/your-feature
git commit -m "feat(frontend): add feature description"
git push origin feature/your-feature
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### MongoDB Atlas (Free)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

## 📱 VS Code Extensions

Install from `.vscode/extensions.json`:
- ESLint
- Prettier
- TypeScript
- Expo Tools
- GitLens

## 🧪 Test Endpoints

```bash
# Health check
GET http://localhost:3000/health

# Register user
POST http://localhost:3000/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "123456", "phone": "1234567890", "role": "rider" }

# Login
POST http://localhost:3000/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }
```

## 📁 Key Files

- `frontend/src/App.tsx` - Main app entry
- `frontend/src/services/api.ts` - API configuration
- `backend/src/server.ts` - Backend entry
- `backend/src/models/User.ts` - User model
- `backend/src/routes/auth.routes.ts` - Auth routes

## 🚀 Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy!

### Frontend
```bash
cd frontend
eas build --platform android
eas build --platform ios
```

## 📚 Documentation

- `README.md` - Overview
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `GIT_SETUP.md` - Git guidelines
- `PROJECT_SUMMARY.md` - Project summary

