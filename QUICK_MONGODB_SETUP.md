# ⚡ Quick MongoDB Setup - Choose Your Option

## 🚀 FASTEST: MongoDB Atlas (Cloud - 5 minutes, No Installation)

### Step 1: Create Free Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with email (free account)

### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Choose **FREE (M0)** tier
3. Select region (choose closest to you)
4. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `diner-admin`
5. Password: Create a strong password (save it!)
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 4: Allow Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for testing)
   - Or add your specific IP for security
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** → **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
   - Looks like: `mongodb+srv://diner-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
4. Replace `<password>` with your actual password
5. Add database name: Change `?retryWrites` to `/diner-db?retryWrites`

### Step 6: Update Backend .env
Open `diner-backend/.env` and update:
```
MONGODB_URI=mongodb+srv://diner-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/diner-db?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx.mongodb.net` with your cluster address

### Step 7: Test Connection
```bash
cd diner-backend
npm run init-admin
```

**Done!** MongoDB is now running in the cloud! ☁️

---

## 🐳 Option 2: Docker (If you install Docker Desktop)

1. **Install Docker Desktop:**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and restart computer

2. **Start MongoDB:**
   ```bash
   cd "C:\Users\Sai sidharth\AFC"
   docker-compose up -d
   ```

3. **Verify:**
   ```bash
   docker ps
   ```

---

## 💻 Option 3: Local MongoDB Installation

1. **Download MongoDB:**
   - https://www.mongodb.com/try/download/community
   - Choose: Windows, MSI

2. **Install:**
   - Run installer
   - Choose "Complete" installation
   - Install as Windows Service

3. **Start:**
   ```bash
   net start MongoDB
   ```

---

## ✅ Recommended: MongoDB Atlas (Cloud)

**Why?**
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works immediately
- ✅ Accessible from anywhere
- ✅ Automatic backups

**Takes only 5 minutes!**

---

## 🎯 After MongoDB is Running

```bash
# Initialize admin user
cd diner-backend
npm run init-admin

# Seed menu items
npm run seed-menu

# Start backend
npm run dev
```

---

**Choose MongoDB Atlas for the fastest setup!** 🚀

