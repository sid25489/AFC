# 🔧 Fix MongoDB Connection

## Current Issue: Authentication Failed

The MongoDB connection string needs to be properly formatted. Here's how to fix it:

### Step 1: Get Correct Connection String from MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click **"Database"** → **"Connect"**
3. Choose **"Connect your application"**
4. Copy the connection string

### Step 2: Format the Connection String

The connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/diner-db?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with your actual password
- If password has special characters, URL encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - `%` becomes `%25`
  - `&` becomes `%26`
  - `+` becomes `%2B`
  - `=` becomes `%3D`

### Step 3: Update .env File

Open `diner-backend/.env` and update:

```
MONGODB_URI=mongodb+srv://captainrogers2425_db_user:YOUR_ENCODED_PASSWORD@cluster0.dzkrfwd.mongodb.net/diner-db?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_ENCODED_PASSWORD` with your password (URL encoded if needed)
- Make sure `/diner-db` is in the path

### Step 4: Verify Database User

1. Go to MongoDB Atlas → **"Database Access"**
2. Check your user `captainrogers2425_db_user` exists
3. Verify password is correct
4. User should have **"Atlas admin"** or **"Read and write to any database"** privileges

### Step 5: Verify Network Access

1. Go to MongoDB Atlas → **"Network Access"**
2. Make sure your IP is allowed (or "Allow Access from Anywhere" for testing)

### Step 6: Test Connection

```bash
cd diner-backend
npm run init-admin
```

---

## Quick Fix: URL Encode Password

If your password has special characters, use this PowerShell command:

```powershell
[System.Web.HttpUtility]::UrlEncode("YOUR_PASSWORD")
```

Or use an online URL encoder: https://www.urlencoder.org/

---

## Alternative: Create New Database User

If authentication keeps failing:

1. Go to MongoDB Atlas → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `diner-admin`
4. Password: Create a simple password (no special characters)
5. Privileges: **"Atlas admin"**
6. Use this new user in connection string

---

**After fixing, run:** `npm run init-admin` again

