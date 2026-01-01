# 🗄️ MongoDB Setup Guide

## ☁️ Option 1: MongoDB Atlas (Cloud - Recommended)

### Steps

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create"

3. **Set Up Database Access:**
   - Go to "Database Access"
   - Add new database user
   - Username: `diner-admin`
   - Password: Create a strong password
   - Database User Privileges: "Atlas admin"

4. **Set Up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for testing)
   - Or add your specific IP

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://diner-admin:yourpassword@cluster0.xxxxx.mongodb.net/diner-db?retryWrites=true&w=majority`

6. **Update Backend .env:**
   ```
   MONGODB_URI=mongodb+srv://diner-admin:yourpassword@cluster0.xxxxx.mongodb.net/diner-db
   ```

---

## 💻 Option 2: Local MongoDB Installation

### Windows Installation

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI installer
   - Download and run installer

2. **Installation Options:**
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (GUI tool - optional)

3. **Verify Installation:**
   ```bash
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Or test connection
   mongosh
   ```

4. **If MongoDB service is not running:**
   ```bash
   # Start MongoDB service
   net start MongoDB
   ```

### Manual Start (if not installed as service)

```bash
# Navigate to MongoDB bin directory (usually)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
mongod --dbpath "C:\data\db"
```

---

## ✅ Verify MongoDB Connection

### Test with mongosh (command line)

```bash
# Connect to local MongoDB
mongosh

# Or connect to specific database
mongosh mongodb://localhost:27017/diner-db

# Should see: Current Mongosh Log ID: ...
```

### Test with Backend

```bash
cd diner-backend
npm run init-admin
# Should see: ✅ Admin user created successfully!
```

---

## 🔧 Troubleshooting

### Port 27017 Already in Use

**Solution 1:** Stop existing MongoDB
```bash
# Windows
net stop MongoDB

# Or kill process
Get-Process -Name mongod | Stop-Process
```

**Solution 2:** Use different port
```bash
# If using local MongoDB on different port:
# Update .env:
MONGODB_URI=mongodb://localhost:27018/diner-db
```

### Connection Refused

- Check if MongoDB is running: `Get-Service MongoDB`
- Verify port: `netstat -an | findstr 27017`
- Check firewall settings
- For MongoDB Atlas: Verify network access settings

---

## 📊 Recommended Setup

**Recommended:** MongoDB Atlas (Option 1)
- Free tier available
- No local installation needed
- Accessible from anywhere
- Automatic backups
- Works immediately

**Alternative:** Local MongoDB (Option 2)
- Full control
- No internet required
- Good for development

---

## 🚀 Next Steps After MongoDB Setup

1. **Initialize Admin:**
   ```bash
   cd diner-backend
   npm run init-admin
   ```

2. **Seed Menu:**
   ```bash
   npm run seed-menu
   ```

3. **Start Backend:**
   ```bash
   npm run dev
   ```

4. **Test Connection:**
   - Visit: `http://localhost:5000/health`
   - Should return: `{"status":"OK"}`

---

**Choose the option that works best for you!** 🎯

