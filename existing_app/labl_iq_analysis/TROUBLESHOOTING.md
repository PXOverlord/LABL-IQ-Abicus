
# 🔧 Labl IQ Rate Analyzer - Troubleshooting Guide

## 🚨 Common Deployment Issues

### Backend Issues

#### 1. Database Connection Errors
**Error**: `Could not connect to database`

**Solutions**:
```bash
# Check DATABASE_URL format
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Verify database is running
# Railway: Check database service status
# Render: Check PostgreSQL service logs

# Test connection manually
psql $DATABASE_URL -c "SELECT 1;"
```

#### 2. Prisma Migration Failures
**Error**: `Migration failed` or `Schema out of sync`

**Solutions**:
```bash
# Reset and re-run migrations
prisma migrate reset --force
prisma migrate deploy

# If in production, create migration manually
prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql
```

#### 3. Docker Build Failures
**Error**: `Docker build failed`

**Solutions**:
```bash
# Check Dockerfile syntax
docker build -t labl-iq-backend .

# Common fixes:
# - Ensure requirements.txt exists
# - Check Python version compatibility
# - Verify all COPY paths are correct

# Test locally first
docker-compose up --build
```

#### 4. CORS Errors
**Error**: `Access to fetch blocked by CORS policy`

**Solutions**:
```env
# Update CORS_ORIGINS in backend
CORS_ORIGINS=https://your-actual-frontend-domain.vercel.app,https://localhost:3000

# Check frontend API URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

#### 5. JWT Token Issues
**Error**: `Invalid token` or `Token expired`

**Solutions**:
```env
# Ensure secrets are set and consistent
SECRET_KEY=your-secret-key-32-chars-minimum
REFRESH_SECRET_KEY=different-secret-key-32-chars-minimum

# Check token expiration settings
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=10080
```

### Frontend Issues

#### 1. Build Failures
**Error**: `Build failed` on Vercel

**Solutions**:
```bash
# Check for TypeScript errors
npm run build

# Common fixes:
# - Fix TypeScript type errors
# - Update dependencies
# - Check environment variables

# Test build locally
npm run build && npm start
```

#### 2. API Connection Issues
**Error**: `Failed to fetch` or `Network error`

**Solutions**:
```env
# Verify API URL is correct
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app

# Check backend health endpoint
curl https://your-backend-domain.railway.app/health

# Verify CORS settings on backend
```

#### 3. Authentication Issues
**Error**: `NextAuth configuration error`

**Solutions**:
```env
# Ensure NextAuth variables are set
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key

# Check callback URLs match
# Verify JWT secrets match between frontend/backend
```

#### 4. File Upload Issues
**Error**: `File upload failed`

**Solutions**:
```bash
# Check file size limits
# Frontend: NEXT_PUBLIC_MAX_FILE_SIZE=52428800
# Backend: MAX_UPLOAD_SIZE=52428800

# Verify file types allowed
# Check uploads directory permissions
# Test with smaller files first
```

### Database Issues

#### 1. Connection Pool Exhausted
**Error**: `Too many connections`

**Solutions**:
```env
# Reduce connection pool size
DATABASE_URL=postgresql://user:pass@host:port/db?connection_limit=5

# Check for connection leaks in code
# Monitor active connections
```

#### 2. Migration Conflicts
**Error**: `Migration conflict detected`

**Solutions**:
```bash
# Check migration history
prisma migrate status

# Resolve conflicts manually
prisma migrate resolve --applied "migration_name"

# Create new migration
prisma migrate dev --name fix_conflict
```

#### 3. Seed Data Issues
**Error**: `Admin user creation failed`

**Solutions**:
```bash
# Check if user already exists
python -c "
from app.core.database import connect_db
from prisma import Prisma
import asyncio

async def check_admin():
    await connect_db()
    db = Prisma()
    await db.connect()
    admin = await db.user.find_first(where={'email': 'admin@labliq.com'})
    print(f'Admin exists: {admin is not None}')
    await db.disconnect()

asyncio.run(check_admin())
"

# Manually create admin user
python scripts/seed_admin.py
```

## 🔍 Debugging Commands

### Backend Debugging
```bash
# Check logs
railway logs --service backend

# Connect to database
railway connect postgresql

# Run commands in production
railway run python scripts/seed_admin.py

# Check environment variables
railway variables
```

### Frontend Debugging
```bash
# Check Vercel logs
vercel logs

# Test build locally
npm run build

# Check environment variables
vercel env ls
```

### Database Debugging
```bash
# Connect to PostgreSQL
psql $DATABASE_URL

# Check tables
\dt

# Check user table
SELECT * FROM users LIMIT 5;

# Check migrations
SELECT * FROM _prisma_migrations;
```

## 📊 Health Check Endpoints

### Backend Health Checks
```bash
# Basic health check
curl https://your-backend.railway.app/health

# Database connectivity
curl https://your-backend.railway.app/api/auth/health

# API documentation
https://your-backend.railway.app/docs
```

### Frontend Health Checks
```bash
# Frontend accessibility
curl https://your-frontend.vercel.app

# API connectivity test
curl https://your-frontend.vercel.app/api/health
```

## 🔧 Performance Issues

### Slow API Responses
1. Check database query performance
2. Monitor memory usage
3. Optimize file upload handling
4. Add caching where appropriate

### High Memory Usage
1. Check for memory leaks
2. Optimize file processing
3. Implement streaming for large files
4. Monitor container resources

## 🚨 Emergency Procedures

### Rollback Deployment
```bash
# Railway: Rollback to previous deployment
railway rollback

# Vercel: Rollback via dashboard
# Go to Deployments → Select previous → Promote to Production
```

### Database Recovery
```bash
# Backup current database
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Reset Application State
```bash
# Reset database (CAUTION: Data loss!)
prisma migrate reset --force

# Recreate admin user
python scripts/seed_admin.py
```

## 📞 Getting Help

### Log Collection
When reporting issues, include:
1. Deployment platform (Railway/Render/Vercel)
2. Error messages from logs
3. Environment variable configuration (without secrets)
4. Steps to reproduce the issue

### Useful Log Commands
```bash
# Railway logs
railway logs --service backend --tail

# Render logs
# Check via dashboard: Service → Logs

# Vercel logs
vercel logs --follow
```

---

💡 **Pro Tip**: Always test changes in a staging environment before deploying to production!
