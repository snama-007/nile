# 🗄️ Supabase Setup Guide - Project Nile

## 📋 Complete Supabase Configuration

This guide walks you through setting up Supabase for Project Nile.

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `project-nile`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for MVP
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

---

### Step 2: Run Database Schema (3 min)

1. **Open SQL Editor**:
   - In Supabase Dashboard
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

2. **Copy Schema**:
   - Open `nile/supabase/schema.sql` from your project
   - Copy ALL contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)

3. **Paste and Run**:
   - Paste into SQL Editor
   - Click **"Run"** or press Cmd/Ctrl + Enter
   - Wait for success message: "Success. No rows returned"

4. **Verify Tables Created**:
   - Click **"Table Editor"** in left sidebar
   - You should see 4 tables:
     - `vendors`
     - `users_public`
     - `tasks`
     - `updates`

---

### Step 3: Verify Realtime (1 min)

**Realtime is automatically enabled by the schema!**

To verify:
1. Go to **Database** → **Replication** (in left sidebar)
2. Find the `updates` table in the list
3. Check that **"Realtime"** column shows as enabled
4. If not enabled, click the toggle to enable it

**Alternative method** (if Replication page doesn't exist):
- Realtime is already enabled via the SQL command in schema
- No manual action needed
- It will work automatically!

---

### Step 4: Get API Keys (2 min)

1. **Go to Settings**:
   - Click **"Settings"** (gear icon) in left sidebar
   - Click **"API"** section

2. **Copy Values**:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJh...xxxxx
   ```

3. **Create `.env.local`**:
   ```bash
   cd nile
   cp .env.local.example .env.local
   ```

4. **Add Your Values**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...xxxxx
   ```

---

### Step 5: Configure Authentication (3 min)

#### For Development (OAuth Optional):
The app will work without OAuth initially, but you'll need it for vendor login.

#### For Production (Required):

1. **Enable Email Provider** (Quick option):
   - Go to **Authentication** → **Providers**
   - **Email** should be enabled by default
   - Configure email templates if desired

2. **Enable Google OAuth** (Recommended):
   - Go to **Authentication** → **Providers**
   - Find **Google** and click
   - Toggle **"Enable Google provider"**
   - Add your **Client ID** and **Client Secret** from [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URL:
     ```
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
     ```

3. **Configure Site URL**:
   - In **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: Add `http://localhost:3000/**`

---

### Step 6: Test Connection (2 min)

1. **Start your app**:
   ```bash
   cd nile
   npm run dev
   ```

2. **Test database connection**:
   - Open browser to `http://localhost:3000`
   - Open browser console (F12)
   - No connection errors should appear

3. **Test pages**:
   - Visit `/dashboard` - should see sign-in prompt
   - Visit `/testuser` - should see "Handle not found"

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] All 4 tables exist (vendors, users_public, tasks, updates)
- [ ] RLS policies are active (check Table Editor → table → RLS tab)
- [ ] Realtime enabled for `updates` table
- [ ] API keys copied to `.env.local`
- [ ] `.env.local` file exists and is NOT committed to git
- [ ] App connects successfully (no console errors)
- [ ] Can view landing page
- [ ] Can access dashboard (shows sign-in)

---

## 🔍 Common Issues & Solutions

### Issue 1: "Failed to fetch"
**Cause**: Wrong API URL or network issue  
**Solution**: 
- Check `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Ensure it matches Project URL in Supabase Settings → API
- Restart dev server: `npm run dev`

### Issue 2: "Invalid API key"
**Cause**: Wrong anon key  
**Solution**:
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Copy fresh key from Supabase Settings → API
- Make sure you copied the **anon/public** key, not service_role

### Issue 3: "JWT expired"
**Cause**: Old API keys cached  
**Solution**:
- Clear browser cache
- Restart dev server
- Check API keys are current

### Issue 4: Can't create tables
**Cause**: SQL syntax error or permissions  
**Solution**:
- Copy schema again carefully
- Run each section separately if needed
- Check for error messages in SQL Editor

### Issue 5: RLS blocking queries
**Cause**: Row Level Security policies  
**Solution**:
- This is expected behavior!
- Public users can read tasks
- Vendors need to sign in to create tasks
- Check policies in Table Editor → table → RLS

### Issue 6: Realtime not working
**Cause**: Realtime not enabled for table  
**Solution**:
- Go to Database → Replication
- Toggle ON for `updates` table
- Or run: `ALTER PUBLICATION supabase_realtime ADD TABLE updates;`

### Issue 7: "relation does not exist"
**Cause**: Tables not created  
**Solution**:
- Re-run entire schema from `schema.sql`
- Check Table Editor to verify tables exist

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# ✅ Good - in .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...

# ❌ Bad - NEVER commit these
# Don't put in package.json, README, or any committed file
```

### RLS Policies
The schema includes proper RLS policies:
- ✅ Vendors can only access their own tasks
- ✅ Public can read tasks by handle
- ✅ Only authenticated vendors can create tasks
- ✅ Handles are public (by design)

### API Keys
- **anon/public key**: Safe to expose (limited permissions)
- **service_role key**: NEVER expose (full admin access)
- Use only anon key in frontend code

---

## 📊 Database Schema Overview

```sql
vendors (4 columns)
├─ id (UUID, Primary Key)
├─ user_id (UUID, → auth.users)
├─ name (TEXT)
└─ created_at (TIMESTAMP)

users_public (3 columns)
├─ handle (TEXT, Primary Key)
├─ name (TEXT)
└─ created_at (TIMESTAMP)

tasks (8 columns)
├─ id (UUID, Primary Key)
├─ title (TEXT)
├─ description (TEXT, nullable)
├─ user_handle (TEXT, → users_public.handle)
├─ vendor_id (UUID, → vendors.id)
├─ task_type (ENUM: 9 types)
├─ status (TEXT, default: 'created')
└─ created_at (TIMESTAMP)

updates (4 columns)
├─ id (UUID, Primary Key)
├─ task_id (UUID, → tasks.id)
├─ message (TEXT)
└─ created_at (TIMESTAMP)
```

---

## 🧪 Testing Your Setup

### Test 1: Create Vendor (Manual)
```sql
-- In SQL Editor:
INSERT INTO vendors (user_id, name)
VALUES ('your-auth-user-id', 'Test Vendor')
RETURNING id;
```

### Test 2: Create Handle
```sql
INSERT INTO users_public (handle, name)
VALUES ('testuser', 'Test User');
```

### Test 3: Create Task
```sql
INSERT INTO tasks (title, user_handle, vendor_id, task_type)
VALUES (
  'Test Task',
  'testuser',
  'your-vendor-id',
  'info'
);
```

### Test 4: Create Update
```sql
INSERT INTO updates (task_id, message)
VALUES ('your-task-id', 'Test update message');
```

### Test 5: Query Everything
```sql
-- View all data
SELECT * FROM vendors;
SELECT * FROM users_public;
SELECT * FROM tasks;
SELECT * FROM updates;
```

---

## 🚀 Production Configuration

### Before Deploying:

1. **Update Site URL**:
   - Authentication → URL Configuration
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

2. **Configure OAuth**:
   - Update Google OAuth redirect URL
   - Add production domain to authorized origins

3. **Environment Variables** (Vercel):
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Test Production**:
   - Verify vendor can sign in
   - Create test task
   - Check real-time updates work

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

## 🎯 Quick Summary

**Setup time**: ~15 minutes

**Steps**:
1. Create project (2 min)
2. Run schema (3 min)
3. Verify realtime (1 min)
4. Get API keys (2 min)
5. Configure auth (3 min)
6. Test connection (2 min)

**Result**: Fully functional backend ready for development!

---

**🎉 Supabase setup complete! Ready to develop!**

