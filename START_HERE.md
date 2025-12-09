# 🚀 START HERE - RideShare Project Setup

## Welcome to RideShare!

This is your complete ride-hailing application project setup. Follow these steps to get started.

## ✅ Quick Checklist

- [ ] Install Node.js (v18+)
- [ ] Install Git
- [ ] Set up MongoDB (local or Atlas)
- [ ] Configure Git user
- [ ] Install dependencies
- [ ] Set up environment variables
- [ ] Start development servers

## 📋 Step-by-Step Setup

### 1. Git Configuration

```bash
# Set your Git user for this project
git config user.name "Awais Akram"
git config user.email "your-email@example.com"

# Verify
git config user.name
git config user.email
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Or install separately:
cd frontend && npm install
cd backend && npm install
```

### 3. Backend Setup

```bash
cd backend

# Copy environment template
cp env.template .env

# Edit .env file with your MongoDB connection:
# - Local: mongodb://localhost:27017/rideshare
# - Atlas: mongodb+srv://username:password@cluster.mongodb.net/rideshare

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:3000**

### 4. Frontend Setup

```bash
cd frontend

# Start Expo development server
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web
- Scan QR code with Expo Go app

### 5. Test the Setup

**Backend Test:**
```bash
# Open browser or use curl
curl http://localhost:3000/health
# Should return: {"status":"OK",...}
```

**Frontend Test:**
- App should load without errors
- Login screen should be visible

## 📦 VS Code Extensions

1. Open VS Code in this project
2. VS Code will prompt to install recommended extensions
3. Click "Install All"
4. Or manually install from `.vscode/extensions.json`

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string
7. Add to `backend/.env` as `MONGODB_URI`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/rideshare`
4. Add to `backend/.env` as `MONGODB_URI`

## 📝 First Git Commit

```bash
git add .
git commit -m "feat: initial project setup

- Add React Native frontend with Expo
- Add Node.js/Express backend with TypeScript
- Configure authentication system
- Setup development environment and tools"
```

## 🎯 Project Structure

```
RideShare/
├── frontend/          # React Native app
├── backend/           # Express API
├── .vscode/           # VS Code settings
├── README.md          # Project overview
├── SETUP_INSTRUCTIONS.md  # Detailed setup
├── GIT_SETUP.md       # Git guidelines
└── QUICK_REFERENCE.md # Quick commands
```

## 🚀 Development Workflow

### Daily Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Making Changes

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "feat(frontend): description"`
4. Push: `git push origin feature/your-feature`

## 📚 Documentation

- **README.md** - Project overview
- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **GIT_SETUP.md** - Git workflow and commit guidelines
- **QUICK_REFERENCE.md** - Quick command reference
- **PROJECT_SUMMARY.md** - Project summary

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB is running/connected
- Verify `.env` file exists and has correct values
- Check port 3000 is not in use

### Frontend won't start
- Clear cache: `expo start -c`
- Reinstall: `rm -rf node_modules && npm install`

### Git issues
- Check Git config: `git config --list`
- Verify remote: `git remote -v`

## ✨ Next Steps

1. ✅ Complete setup (you are here)
2. ⏳ Implement user authentication
3. ⏳ Add user profile
4. ⏳ Build ride booking
5. ⏳ Add real-time tracking
6. ⏳ Deploy to production

## 🎉 You're All Set!

Your RideShare project is ready for development. Happy coding! 🚀

---

**Need help?** Check the documentation files or see `SETUP_INSTRUCTIONS.md` for detailed help.




