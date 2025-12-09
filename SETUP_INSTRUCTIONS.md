# RideShare - Complete Setup Instructions

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** (local) or **MongoDB Atlas** account (free) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Expo CLI** (optional, for mobile development)

## 🚀 Quick Start

### 1. Clone and Setup Git

```bash
# If not already initialized
git init

# Set your Git user (if not set globally)
git config user.name "Awais Akram"
git config user.email "your-email@example.com"

# Check your Git config
git config --list
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/rideshare
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/rideshare

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

You can then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### 4. Test the Setup

#### Backend Test
```bash
# In browser or Postman
GET http://localhost:3000/health
# Should return: {"status":"OK","message":"RideShare API is running",...}
```

#### Frontend Test
- Open the app in Expo
- You should see the Login screen
- The app should load without errors

## 📦 VS Code Extensions Setup

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. VS Code will automatically suggest installing recommended extensions from `.vscode/extensions.json`
4. Click "Install All" or install individually:
   - ESLint
   - Prettier
   - TypeScript
   - Expo Tools
   - GitLens
   - Error Lens

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:19006
```

### Frontend
Update `frontend/src/services/api.ts` with your backend URL:
- Development: `http://localhost:3000/api`
- Production: Your deployed backend URL

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/rideshare`
7. Add to `backend/.env` as `MONGODB_URI`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/rideshare`
4. Add to `backend/.env` as `MONGODB_URI`

## 📱 Mobile Development Setup

### For Android
1. Install Android Studio
2. Set up Android emulator
3. Run `npm start` and press `a`

### For iOS (Mac only)
1. Install Xcode
2. Install iOS Simulator
3. Run `npm start` and press `i`

### For Physical Device
1. Install Expo Go app from App Store/Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app

## 🚀 Deployment

### Backend Deployment (Railway - Free Tier)

1. Push code to GitHub
2. Go to [Railway](https://railway.app/)
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select your repository
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (auto-set by Railway)
7. Deploy!

### Backend Deployment (Render - Free Tier)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Sign up with GitHub
4. Click "New" → "Web Service"
5. Connect your repository
6. Set build command: `npm install && npm run build`
7. Set start command: `npm start`
8. Add environment variables
9. Deploy!

### Frontend Deployment

#### Option 1: Expo EAS Build
```bash
cd frontend
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
eas build --platform ios
```

#### Option 2: Expo Build
```bash
cd frontend
expo build:android
expo build:ios
```

## 📝 Git Workflow

### Initial Commit
```bash
git add .
git commit -m "feat: initial project setup

- Add React Native frontend with Expo
- Add Node.js/Express backend
- Configure TypeScript for both projects
- Add authentication routes and models
- Setup development environment"
```

### Feature Development
```bash
# Create feature branch
git checkout -b feature/ride-booking

# Make changes and commit
git add .
git commit -m "feat(frontend): add ride booking screen

- Implement booking form
- Add map integration
- Connect to booking API"

# Push and create PR
git push origin feature/ride-booking
```

See `GIT_SETUP.md` for detailed Git guidelines.

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in .env or kill process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

**MongoDB connection failed:**
- Check MongoDB is running (local)
- Verify connection string in .env
- Check network/IP whitelist (Atlas)

### Frontend Issues

**Expo not starting:**
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Module not found:**
```bash
# Clear Metro bundler cache
npm start -- --reset-cache
```

## 📚 Next Steps

1. ✅ Complete authentication flow
2. ✅ Add user profile management
3. ✅ Implement ride booking
4. ✅ Add real-time location tracking
5. ✅ Integrate payment gateway
6. ✅ Add push notifications
7. ✅ Implement driver matching algorithm

## 🆘 Need Help?

- Check the README.md for project overview
- Review GIT_SETUP.md for Git guidelines
- Check official documentation:
  - [Expo Docs](https://docs.expo.dev/)
  - [React Native Docs](https://reactnative.dev/)
  - [Express Docs](https://expressjs.com/)
  - [MongoDB Docs](https://docs.mongodb.com/)




