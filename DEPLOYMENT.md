# Meal Tracker - Deployment Guide

## Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account (for production database)

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `meal-tracker`
3. Make it public or private (your choice)
4. Don't initialize with README (we already have one)

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/meal-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set up MongoDB Atlas (Production Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/meal-tracker`)

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
5. Deploy!

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add NODE_ENV production

# Redeploy with environment variables
vercel --prod
```

## Environment Variables Needed

For production deployment, you need these environment variables in Vercel:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: `production`

## Project Structure

```
meal-tracker/
├── src/                 # React frontend
├── backend/            # Node.js/Express API
├── vercel.json         # Vercel configuration
├── package.json        # Frontend dependencies
└── README.md          # Project documentation
```

## API Endpoints

The backend provides these API endpoints:
- `/api/food-items` - Food items CRUD
- `/api/meals` - Meals CRUD and analytics
- `/api/profile` - User profile management
- `/api/health` - Health check

## Features

✅ Meal logging with searchable food database
✅ Nutritional tracking (calories, protein, carbs, fat)
✅ Daily meal history
✅ Analytics and trends
✅ User profile management
✅ Responsive design
✅ Real-time data updates

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Recharts
- Lucide React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Input validation

**Deployment:**
- Vercel (Frontend + Serverless Functions)
- MongoDB Atlas (Database) 