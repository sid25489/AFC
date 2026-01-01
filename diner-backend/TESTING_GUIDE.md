# 🧪 Testing Guide

Complete testing guide for the Diner Frontend + Backend integration.

---

## 📋 Prerequisites

1. **MongoDB** running (local or MongoDB Atlas)
2. **Node.js** 18+ installed
3. Both frontend and backend projects set up

---

## 🚀 Initial Setup

### 1. Backend Setup

```bash
cd diner-backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Set these values:
# MONGODB_URI=mongodb://localhost:27017/diner-db
# JWT_SECRET=your-secret-key-here
# FRONTEND_URL=http://localhost:3000

# Initialize admin user
npm run init-admin

# Seed menu items (optional)
npm run seed-menu

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📝 Environment: development
```

### 2. Frontend Setup

```bash
cd diner-frontend

# Install dependencies
npm install

# Create .env.local file
# Add: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend server
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

## ✅ Testing Checklist

### 1. Backend API Tests

#### Health Check
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status":"OK","message":"Server is running"}`

#### Get Menu Items
```bash
curl http://localhost:5000/api/menu
```
**Expected:** JSON array of menu items

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@diner.com","password":"admin123"}'
```
**Expected:** JSON with user data and token

#### Create Order (Public)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "+1234567890",
    "items": [{"menuItemId": "ITEM_ID_HERE", "quantity": 2}],
    "deliveryType": "dine-in",
    "paymentMethod": "cash"
  }'
```
**Expected:** Order created with order number

---

### 2. Frontend Tests

#### Homepage
- [ ] Visit `http://localhost:3000`
- [ ] Hero section displays correctly
- [ ] Navigation links work
- [ ] Animations are smooth

#### Menu Page
- [ ] Visit `http://localhost:3000/menu`
- [ ] Menu items load from backend
- [ ] Categories are displayed
- [ ] Prices show correctly
- [ ] Happy hour pricing displays (if applicable)

#### Order Online Page
- [ ] Visit `http://localhost:3000/order`
- [ ] Menu items load from backend
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items from cart
- [ ] Click "Proceed to Checkout"
- [ ] Fill out checkout form
- [ ] Submit order
- [ ] See success message with order number

#### Admin Login
- [ ] Visit `http://localhost:3000/admin/login`
- [ ] Login with admin credentials
- [ ] Redirected to dashboard

#### Admin Dashboard
- [ ] View all menu items
- [ ] Click "Add Menu Item"
- [ ] Fill form and create new item
- [ ] Click "Edit" on existing item
- [ ] Update item details
- [ ] Click "Delete" on item (soft delete)
- [ ] Click "Manage Orders"
- [ ] View all orders
- [ ] Filter orders by status
- [ ] Update order status

---

## 🐛 Common Issues & Solutions

### Backend Issues

**MongoDB Connection Error**
```
Error: MongoDB connection error
```
**Solution:**
- Check MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env`

**Port Already in Use**
```
Error: Port 5000 is already in use
```
**Solution:**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill the process: `npx kill-port 5000`

**JWT Token Invalid**
```
Error: Not authorized, token failed
```
**Solution:**
- Check `JWT_SECRET` is set in `.env`
- Make sure token is included in Authorization header: `Bearer <token>`

### Frontend Issues

**API Connection Error**
```
Network error. Please check your connection.
```
**Solution:**
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

**Menu Items Not Loading**
```
Failed to load menu
```
**Solution:**
- Check backend is running
- Verify API endpoint: `http://localhost:5000/api/menu`
- Check browser console for errors

**Admin Login Fails**
```
Invalid credentials
```
**Solution:**
- Run `npm run init-admin` in backend
- Use default credentials: `admin@diner.com` / `admin123`
- Check backend logs for errors

---

## 📊 Test Data

### Default Admin Credentials
- **Email:** `admin@diner.com`
- **Password:** `admin123`

### Sample Order Data
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "items": [
    {
      "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "quantity": 2
    }
  ],
  "deliveryType": "dine-in",
  "paymentMethod": "card"
}
```

---

## 🎯 Integration Test Flow

1. **Start Backend** → `npm run dev` in `diner-backend`
2. **Start Frontend** → `npm run dev` in `diner-frontend`
3. **Test Menu** → Visit `/menu`, verify items load
4. **Test Order** → Visit `/order`, add items, place order
5. **Test Admin** → Login, create/edit menu items, manage orders
6. **Verify Data** → Check MongoDB for created orders

---

## 🔍 Debugging Tips

### Backend Logs
- Check console for MongoDB connection
- Watch for API request logs
- Monitor error messages

### Frontend Console
- Open browser DevTools (F12)
- Check Network tab for API calls
- Look for errors in Console tab

### MongoDB Verification
```bash
# Connect to MongoDB
mongosh

# Use database
use diner-db

# Check collections
show collections

# View menu items
db.menuitems.find().pretty()

# View orders
db.orders.find().pretty()

# View users
db.users.find().pretty()
```

---

## ✅ Success Criteria

- ✅ Backend server starts without errors
- ✅ Frontend connects to backend API
- ✅ Menu items load from backend
- ✅ Orders can be created successfully
- ✅ Admin can login and manage menu
- ✅ Order status can be updated
- ✅ All pages render correctly
- ✅ No console errors

---

**Happy Testing! 🎉**

