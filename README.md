# RideShare - Ride-Hailing Application Clone

A full-stack ride-hailing application built with React Native (Expo) and Node.js/Express backend.

## 🚀 Project Name: **RideShare**

## 📋 Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Query / TanStack Query** - Data fetching and caching
- **Zustand / Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Expo Location** - Location services
- **Expo Maps** - Map integration

### Backend
- **Node.js** with **Express** - RESTful API
- **TypeScript** - Type safety
- **MongoDB** with **Mongoose** - Database (free tier: MongoDB Atlas)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time updates
- **Express Validator** - Input validation
- **Multer** - File uploads

### Deployment
- **Frontend**: Expo EAS Build / React Native builds
- **Backend**: Railway / Render / Heroku (free tiers available)
- **Database**: MongoDB Atlas (free tier)

## 📁 Project Structure

```
RideShare/
├── frontend/          # React Native Expo app
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── app.json
│   └── package.json
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── server.ts
│   └── package.json
├── .gitignore
├── .prettierrc
├── .eslintrc.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Expo CLI: `npm install -g expo-cli`
- MongoDB Atlas account (free) or local MongoDB

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

### Backend Setup

```bash
cd backend
npm install
cp env.template .env
# Edit .env with your MongoDB connection string
npm run dev
```

## 🔧 Development

### Running Frontend
```bash
cd frontend
npm start
```

### Running Backend
```bash
cd backend
npm run dev
```

## 📝 Git Configuration

See `GIT_SETUP.md` for detailed Git setup instructions.

## 🚀 Deployment

### Backend Deployment (Railway - Free Tier)
1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Set environment variables
4. Deploy!

### Frontend Deployment
- Use Expo EAS Build for production builds
- Or build native apps with `expo build`

## 📦 VS Code Extensions

See `.vscode/extensions.json` for recommended extensions.

## 👤 Author

Awais Akram

## 📄 License

MIT

