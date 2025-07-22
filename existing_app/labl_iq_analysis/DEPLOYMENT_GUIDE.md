
# 🚀 Labl IQ Rate Analyzer - Complete Deployment Guide

This guide will walk you through deploying your Labl IQ Rate Analyzer application to production using Vercel (frontend) and Railway or Render (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account
- Railway account OR Render account
- Your application code ready for deployment

## 🏗️ Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: FastAPI app deployed on Railway/Render with Docker
- **Database**: PostgreSQL managed database
- **File Storage**: Server-side uploads directory

## 🔧 Backend Deployment

### Option A: Deploy to Railway (Recommended)

#### 1. Prepare Your Repository
```bash
cd ~/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend
git init
git add .
git commit -m "Initial commit for deployment"
git remote add origin https://github.com/yourusername/labl-iq-backend.git
git push -u origin main
```

#### 2. Set Up Railway Project
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway will automatically detect the Dockerfile

#### 3. Add PostgreSQL Database
1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Railway will create a PostgreSQL instance and provide connection details

#### 4. Configure Environment Variables
In Railway dashboard, go to your backend service → Variables:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
SECRET_KEY=your-super-secret-key-change-this-now
REFRESH_SECRET_KEY=your-refresh-secret-key-change-this-now
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://your-frontend-domain.vercel.app
PORT=8000
```

#### 5. Deploy and Initialize Database
1. Railway will automatically deploy your app
2. Once deployed, run database migrations:
   - Go to Railway dashboard → your service → "Deploy Logs"
   - Or use Railway CLI: `railway run python -m prisma migrate deploy`

#### 6. Create Admin User
```bash
# Using Railway CLI
railway run python scripts/seed_admin.py

# Or set environment variables in Railway dashboard:
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
```

### Option B: Deploy to Render

#### 1. Prepare Repository (same as Railway)

#### 2. Create Render Services
1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` configuration

#### 3. The render.yaml will automatically:
- Create PostgreSQL database
- Set up web service with Docker
- Configure environment variables
- Set up health checks

#### 4. Manual Environment Variables (if needed)
If not using render.yaml, manually add:
- `SECRET_KEY` (generate a secure key)
- `REFRESH_SECRET_KEY` (generate another secure key)
- `CORS_ORIGINS` (your frontend domain)

## 🌐 Frontend Deployment

### Deploy to Vercel

#### 1. Prepare Frontend Repository
```bash
cd ~/labl_iq_frontend_figma/app
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/labl-iq-frontend.git
git push -u origin main
```

#### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your frontend repository
4. Vercel will auto-detect Next.js settings

#### 3. Configure Environment Variables
In Vercel dashboard → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXT_PUBLIC_APP_NAME=Labl IQ Rate Analyzer
NEXT_PUBLIC_ENVIRONMENT=production
```

#### 4. Update CORS Settings
After frontend deployment, update your backend CORS_ORIGINS:
```env
CORS_ORIGINS=https://your-actual-frontend-domain.vercel.app
```

## 🔄 Database Setup & Migration

### 1. Run Prisma Migrations
```bash
# On Railway
railway run prisma migrate deploy

# On Render (via dashboard terminal or deploy script)
prisma migrate deploy
```

### 2. Generate Prisma Client
```bash
# This happens automatically in Docker build
prisma generate
```

### 3. Seed Initial Data
```bash
# Create admin user
python scripts/seed_admin.py
```

## 🔐 Security Configuration

### 1. Generate Secure Keys
```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate REFRESH_SECRET_KEY  
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate NEXTAUTH_SECRET
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Update Default Passwords
- Change admin password after first login
- Use strong, unique passwords for database
- Rotate JWT secrets regularly

## 📊 Post-Deployment Checklist

### ✅ Backend Health Checks
1. Visit `https://your-backend-domain.railway.app/health`
2. Should return: `{"status": "ok", "version": "1.0.0", "environment": "production"}`
3. Check `/docs` for API documentation

### ✅ Frontend Verification
1. Visit your Vercel domain
2. Test user registration/login
3. Test file upload functionality
4. Verify API connectivity

### ✅ Database Verification
1. Check database connection in backend logs
2. Verify admin user creation
3. Test user registration creates database records

### ✅ File Upload Testing
1. Upload a CSV file
2. Verify file processing works
3. Check analysis results display

## 🔧 Environment Variables Reference

### Backend (.env.production)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT Security
SECRET_KEY=your-secret-key
REFRESH_SECRET_KEY=your-refresh-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=10080

# Application
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://your-frontend.vercel.app

# Admin User (for seeding)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### Frontend (.env.production)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# NextAuth
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# App Configuration
NEXT_PUBLIC_APP_NAME=Labl IQ Rate Analyzer
NEXT_PUBLIC_ENVIRONMENT=production
```

## 🚨 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## 📞 Support

If you encounter issues:
1. Check the troubleshooting guide
2. Review deployment logs in Railway/Render dashboard
3. Verify all environment variables are set correctly
4. Ensure database migrations completed successfully

---

🎉 **Congratulations!** Your Labl IQ Rate Analyzer is now live in production!
