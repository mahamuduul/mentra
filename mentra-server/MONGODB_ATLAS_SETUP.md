# MongoDB Atlas Setup Guide

## Current Issue: Authentication Failed ❌

The error `bad auth : authentication failed` means:
- Username or password is incorrect
- Database user doesn't exist
- IP address is not whitelisted

## Steps to Fix:

### 1. Go to MongoDB Atlas Dashboard
Visit: https://cloud.mongodb.com/

### 2. Create/Update Database User

1. Click on **Database Access** (left sidebar)
2. Click **"Add New Database User"** or **Edit** existing user
3. Set credentials:
   - **Username:** `mentraadmin` (or create new)
   - **Password:** Create a strong password (IMPORTANT: Save this!)
   - **Database User Privileges:** Select **"Atlas admin"** or **"Read and write to any database"**
4. Click **"Add User"** or **"Update User"**

### 3. Whitelist Your IP Address

1. Click on **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose one:
   - **"Allow access from anywhere"** → `0.0.0.0/0` (for testing)
   - **"Add current IP address"** → Your current IP
4. Click **"Confirm"**

### 4. Get Your Connection String

1. Go to **Database** → Click **"Connect"**
2. Select **"Connect your application"**
3. Choose **Driver: Node.js** and **Version: 6.7 or later**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Update Your .env File

Replace the values in `mentra-server/.env`:

```env
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.crlsfbw.mongodb.net/mentra_db?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=mentra_db
```

Replace:
- `<USERNAME>` with your database username
- `<PASSWORD>` with your database password (URL encoded - no special characters!)

**Important:** If your password contains special characters like `@`, `#`, `$`, etc., you need to URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

Or better: Create a password without special characters!

### 6. Test Connection

Run:
```bash
cd E:/Projects/Mentra/mentra-server
node test-insert-data.js
```

If successful, you'll see:
```
✅ Connected to MongoDB
👥 Inserting fake users...
✅ Inserted 3 users
😊 Creating mood entries...
✅ Inserted 15 mood entries
📔 Creating journal entries...
✅ Inserted 4 journal entries
🎉 FAKE DATA INSERTION COMPLETE!
```

## Alternative: Use MongoDB Compass

1. Download **MongoDB Compass**: https://www.mongodb.com/products/tools/compass
2. Use your connection string to connect
3. View your `mentra_db` database visually
4. Check collections: `mentra_users`, `moodentries`, `journalentries`

---

## Once Connected:

After updating `.env` with correct credentials:

1. **Test the connection:**
   ```bash
   node test-insert-data.js
   ```

2. **Start your server:**
   ```bash
   npm run dev
   ```

3. **Test login flow:**
   - Login to your app
   - User will be created in MongoDB Atlas
   - Fill out survey
   - Data will be saved to Atlas

---

Need help? Let me know your MongoDB Atlas cluster name and I'll help you format the connection string!
