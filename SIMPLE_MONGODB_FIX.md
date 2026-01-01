# ⚡ Simple MongoDB Fix - 5 Minutes

## 🎯 Quick Fix Steps

### Step 1: Open MongoDB Atlas
1. Go to: **https://cloud.mongodb.com**
2. Login to your account

### Step 2: Create New User (2 minutes)
1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"** (green button)
3. Fill in:
   - **Username:** `diner-admin`
   - **Password:** `DinerAdmin2024` (or your own simple password)
   - **Privileges:** Select **"Atlas admin"**
4. Click **"Add User"**
5. **SAVE THE PASSWORD!**

### Step 3: Allow Network Access (1 minute)
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"** (green button)
3. Click **"Allow Access from Anywhere"**
4. Click **"Confirm"**

### Step 4: Get Connection String (1 minute)
1. Click **"Database"** → **"Connect"**
2. Click **"Connect your application"**
3. Copy the connection string shown
4. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update .env File (1 minute)

**Option A: Use the helper script**
```powershell
cd diner-backend
.\update-mongodb-uri.ps1
```
Then enter:
- Username: `diner-admin`
- Password: `DinerAdmin2024` (or your password)
- Cluster: `cluster0.dzkrfwd.mongodb.net` (or press Enter for default)

**Option B: Manual update**
1. Open `diner-backend/.env` in a text editor
2. Find the line: `MONGODB_URI=...`
3. Replace with:
   ```
   MONGODB_URI=mongodb+srv://diner-admin:DinerAdmin2024@cluster0.dzkrfwd.mongodb.net/diner-db?retryWrites=true&w=majority
   ```
4. **Replace `DinerAdmin2024` with your actual password!**
5. Save the file

### Step 6: Test Connection
```bash
cd diner-backend
node test-connection.js
```

**If successful, you'll see:**
```
✅ MongoDB Connected Successfully!
✅ Connection test passed!
```

### Step 7: Initialize Backend
```bash
npm run init-admin
npm run seed-menu
npm run dev
```

---

## ✅ Success Checklist

After Step 6, you should see:
- [x] ✅ MongoDB Connected Successfully!
- [x] Connection test passed!

Then you can:
- [x] Initialize admin user
- [x] Seed menu items
- [x] Start backend server
- [x] Test full application

---

## 🆘 Still Having Issues?

**Common problems:**

1. **"bad auth" error:**
   - Double-check password is correct
   - Make sure no extra spaces in connection string
   - Wait 1-2 minutes after creating user

2. **"Network timeout" error:**
   - Check network access is configured
   - Make sure "Allow Access from Anywhere" is set

3. **"ENOTFOUND" error:**
   - Check cluster address is correct
   - Verify internet connection

---

**That's it! Follow these steps and MongoDB will be working in 5 minutes!** 🚀

