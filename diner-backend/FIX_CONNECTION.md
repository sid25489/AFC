# 🔧 Fix MongoDB Connection - Step by Step

## Current Issue
Authentication failed - the connection string needs to be verified and corrected.

## Quick Fix Steps

### Step 1: Get Fresh Connection String from MongoDB Atlas

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Login to your account

2. **Navigate to Connect:**
   - Click **"Database"** in left sidebar
   - Click **"Connect"** button on your cluster

3. **Choose Connection Method:**
   - Click **"Connect your application"**
   - Driver: **Node.js**
   - Version: **5.5 or later**

4. **Copy Connection String:**
   - You'll see: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **DO NOT copy yet** - we need to modify it

### Step 2: Verify Database User

1. **Go to Database Access:**
   - Click **"Database Access"** in left sidebar
   - Find your user: `captainrogers2425_db_user`
   - Click **"Edit"** (pencil icon)

2. **Check/Reset Password:**
   - If you know the password: Verify it matches
   - If you don't: Click **"Edit Password"** and create a new one
   - **SAVE THE PASSWORD** - you'll need it!

3. **Verify Privileges:**
   - Should be: **"Atlas admin"** or **"Read and write to any database"**

### Step 3: Verify Network Access

1. **Go to Network Access:**
   - Click **"Network Access"** in left sidebar
   - Check if your IP is listed
   - If not: Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for testing
   - Click **"Confirm"**

### Step 4: Format Connection String Correctly

The connection string should be:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/diner-db?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with: `captainrogers2425_db_user`
- Replace `<password>` with: **YOUR ACTUAL PASSWORD**
- Make sure `/diner-db` is in the path (before the `?`)
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

### Step 5: Update .env File

Open `diner-backend/.env` and set:

```
MONGODB_URI=mongodb+srv://captainrogers2425_db_user:YOUR_PASSWORD@cluster0.dzkrfwd.mongodb.net/diner-db?retryWrites=true&w=majority
```

**Replace `YOUR_PASSWORD` with your actual password!**

### Step 6: Test Connection

```bash
cd diner-backend
npm run init-admin
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
✅ Admin user created successfully!
```

---

## Alternative: Create New User (If Current One Doesn't Work)

1. **Database Access** → **"Add New Database User"**
2. Username: `diner-admin`
3. Password: Create a simple password (no special characters)
4. Privileges: **"Atlas admin"**
5. Use this new user in connection string

---

## Troubleshooting

### Still Getting "bad auth" Error?

1. **Double-check password** - Make sure it matches exactly
2. **URL encode password** - If it has special characters
3. **Wait 1-2 minutes** - After creating/changing user
4. **Check network access** - Make sure IP is allowed
5. **Try new user** - Create fresh user with simple password

### Connection String Format Checklist

- ✅ Has `mongodb+srv://` prefix
- ✅ Has username before `:`
- ✅ Has password after `:` and before `@`
- ✅ Has cluster address after `@`
- ✅ Has `/diner-db` before `?`
- ✅ Has `?retryWrites=true&w=majority` at end
- ✅ No extra slashes (`//`)
- ✅ Password is URL encoded if needed

---

**After fixing, run `npm run init-admin` to test!**

