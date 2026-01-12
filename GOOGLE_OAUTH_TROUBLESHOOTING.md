# Google OAuth Troubleshooting Guide

## "Invalid Google token" Error - Quick Fix

### Step 1: Verify Google Cloud Console Settings

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID: `31955147072-lvk3g6ec9hn8co9a5e5fhlgu78ud6eqr`

### Step 2: Check Authorized JavaScript Origins

Click **Edit** on your OAuth client and verify these are added:

**Required Origins:**
```
http://localhost:3000
http://localhost
```

**How to add:**
1. Under "Authorized JavaScript origins"
2. Click "+ ADD URI"
3. Add `http://localhost:3000`
4. Click "+ ADD URI" again
5. Add `http://localhost`
6. Click **SAVE**

### Step 3: Check Authorized Redirect URIs

These are CRITICAL for @react-oauth/google to work:

**Required Redirect URIs:**
```
http://localhost:3000
```

**Optional (but recommended):**
```
http://localhost:3000/login
http://localhost:3000/register
```

### Step 4: Verify OAuth Consent Screen

1. Go to **OAuth consent screen** (left sidebar)
2. Make sure:
   - ✅ App name is filled in
   - ✅ User support email is filled in
   - ✅ Developer contact email is filled in
3. If it says "Testing" - that's fine for development
4. Add your test email to "Test users" if in Testing mode

### Step 5: Common Mistakes to Avoid

❌ **Don't use HTTPS** for localhost (use `http://`)
❌ **Don't include trailing slashes** (`http://localhost:3000/` ❌)
❌ **Don't forget the port** (`:3000`)
❌ **Don't mix www/non-www**

### Step 6: After Making Changes

1. **Wait 5-10 minutes** - Google changes can take time to propagate
2. **Clear browser cache** or use incognito mode
3. **Restart both servers**
4. **Try again**

### Step 7: Check for CORS Issues

If you're still getting the error, check your backend terminal for errors like:
- `CORS error`
- `Failed to verify token`
- Any error messages from `google-auth-library`

### Quick Verification Checklist

Open this URL to check your Client ID is valid:
```
https://oauth2.googleapis.com/tokeninfo?id_token=YOUR_TOKEN
```

But first, try these settings in Google Cloud Console!

---

## Alternative: Create New OAuth Credentials

If nothing works, create fresh credentials:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `Diner App - Development`
5. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost`
6. Authorized redirect URIs:
   - `http://localhost:3000`
7. Click **CREATE**
8. Copy the new Client ID and Client Secret
9. Update both `.env` files

---

## Need Help?

Share the exact error message from:
1. Browser console (F12 → Console tab)
2. Backend server terminal
3. Frontend server terminal
