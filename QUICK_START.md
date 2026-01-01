# 🚀 Quick Start Guide

## ⚠️ MongoDB Required

The backend requires MongoDB to be running. You have two options:

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create free account:** https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier available)
3. **Get connection string** and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diner-db
   ```

### Option 2: Local MongoDB Installation

1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Install as Windows Service

2. **Start MongoDB:**
   - Windows: MongoDB should start automatically as a service
   - Or run: `net start MongoDB` in a terminal

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # Should connect successfully
   ```

1. **Create free account:** https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free tier available)
3. **Get connection string** and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diner-db
   ```

---

## 📋 Setup Steps

### 1. Backend Setup

```bash
cd diner-backend

# Install dependencies (if not done)
npm install

# Create .env file (already exists, but verify these settings):
# MONGODB_URI=mongodb://localhost:27017/diner-db
# JWT_SECRET=your-secret-key
# FRONTEND_URL=http://localhost:3000

# Initialize admin user (requires MongoDB running)
npm run init-admin

# Seed menu items (optional)
npm run seed-menu

# Start backend server
npm run dev
```

**Expected:** Server running on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd diner-frontend

# Install dependencies (if not done)
npm install

# Create .env.local (already exists, but verify):
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend server
npm run dev
```

**Expected:** Frontend running on `http://localhost:3000`

---

## ✅ Testing Checklist

### Backend Tests (with MongoDB running)

1. **Health Check:**
   - Visit: `http://localhost:5000/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Get Menu:**
   - Visit: `http://localhost:5000/api/menu`
   - Should return JSON array of menu items

3. **Admin Login:**
   - POST to: `http://localhost:5000/api/auth/login`
   - Body: `{"email":"admin@diner.com","password":"admin123"}`
   - Should return token

### Frontend Tests

1. **Homepage:**
   - Visit: `http://localhost:3000`
   - Should show hero section

2. **Menu Page:**
   - Visit: `http://localhost:3000/menu`
   - Should load menu items from backend

3. **Order Page:**
   - Visit: `http://localhost:3000/order`
   - Add items to cart
   - Place order

4. **Admin:**
   - Visit: `http://localhost:3000/admin/login`
   - Login: `admin@diner.com` / `admin123`
   - Manage menu items and orders

---

## 🐛 Current Issue

**MongoDB is not running.** 

To proceed with full testing:
1. Start MongoDB (see options above)
2. Run `npm run init-admin` in backend
3. Run `npm run seed-menu` in backend
4. Start backend: `npm run dev`
5. Start frontend: `npm run dev`

---

## 🎯 Quick Test (Frontend Only - Limited)

You can test the frontend UI without backend:
- Frontend will show errors when trying to load menu
- UI components will still render
- Navigation works
- But API calls will fail

For full functionality, MongoDB + Backend must be running.

