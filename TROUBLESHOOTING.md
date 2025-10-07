# 🔧 Troubleshooting Guide - Project Nile

## Common Issues & Solutions

---

## 🔒 Row Level Security (RLS) Errors

### Error: "new row violates row-level security policy for table 'tasks'"

**Cause:** Supabase RLS policies are blocking the insert because there's no authenticated user context.

**Solution:**

Run this SQL in Supabase SQL Editor:

```sql
-- Fix RLS policies to allow test vendor
DROP POLICY IF EXISTS "Vendors can insert own tasks" ON tasks;

CREATE POLICY "Vendors can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (vendor_id IN (SELECT id FROM vendors));
```

**Alternative (For Testing Only):**

Temporarily disable RLS:

```sql
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE updates DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** Re-enable before production:
```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
```

---

### Error: "new row violates row-level security policy for table 'updates'"

**Solution:**

```sql
DROP POLICY IF EXISTS "Vendors can insert updates for own tasks" ON updates;

CREATE POLICY "Vendors can insert updates"
  ON updates FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT t.id FROM tasks t
      JOIN vendors v ON t.vendor_id = v.id
    )
  );
```

---

## 🗄️ Database Issues

### Error: "Failed to fetch" or "Connection error"

**Causes & Solutions:**

1. **Wrong Supabase URL**
   ```bash
   # Check .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   ```

2. **Wrong API Key**
   ```bash
   # Use ANON key, not SERVICE_ROLE key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```

3. **Restart Dev Server**
   ```bash
   # Stop and restart
   npm run dev
   ```

---

### Error: "relation 'tasks' does not exist"

**Cause:** Database schema not created.

**Solution:**

Run the complete schema from `supabase/schema.sql` in Supabase SQL Editor.

---

### Error: "duplicate key value violates unique constraint"

**Cause:** Handle or vendor ID already exists.

**Solution:**

Use a different handle or update the existing record:

```sql
-- For handles
DELETE FROM users_public WHERE handle = 'yourhandle';

-- For vendors
DELETE FROM vendors WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## 🔑 Authentication Issues

### Error: "No user found" or "Invalid login credentials"

**For /dashboard:**

1. **Set up OAuth properly** in Supabase → Authentication → Providers
2. **Add authorized domains** in Supabase Auth settings
3. **Use correct redirect URLs**

**For /dashboard-test:**

No authentication needed! Just create the test vendor.

---

### Error: "OAuth callback error"

**Solution:**

1. Check Google OAuth credentials
2. Update authorized redirect URLs:
   ```
   http://localhost:3000/dashboard
   https://your-project.supabase.co/auth/v1/callback
   ```

---

## 🎯 Handle Creation Issues

### Error: "This handle is already taken"

**Solution:**

Choose a different handle or delete the existing one:

```sql
DELETE FROM users_public WHERE handle = 'yourhandle';
```

---

### Handles not appearing in search

**Cause:** Case sensitivity or no handles created.

**Solution:**

1. **Create test handles:**
   ```sql
   INSERT INTO users_public (handle, name)
   VALUES 
     ('john', 'John Doe'),
     ('jane', 'Jane Smith'),
     ('test', 'Test User');
   ```

2. **Check search is working:**
   ```sql
   SELECT * FROM users_public WHERE handle ILIKE '%jo%';
   ```

---

## ⚡ Real-time Issues

### Updates not appearing in real-time

**Causes & Solutions:**

1. **Realtime not enabled**
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE updates;
   ```

2. **Check Realtime in Dashboard:**
   - Go to Database → Replication
   - Ensure `updates` table has Realtime enabled

3. **Refresh the page:**
   - Sometimes the WebSocket connection needs to reconnect

---

## 🎨 UI/Display Issues

### Animations not working

**Cause:** Tailwind config not loaded.

**Solution:**

```bash
# Rebuild
npm run build

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

### Colors look wrong

**Cause:** Tailwind not processing custom colors.

**Solution:**

Check `tailwind.config.ts` includes your custom colors and rebuild.

---

## 📱 Mobile Issues

### Touch targets too small

**Solution:**

Buttons should be minimum 44×44px. Check your component styles.

---

### Page not responsive

**Cause:** Missing viewport meta tag.

**Solution:**

Check `src/app/layout.tsx` includes viewport configuration.

---

## 🚀 Build/Deploy Issues

### Build fails with TypeScript errors

**Solution:**

```bash
# Check for errors
npm run lint

# Fix any type issues
# Run build
npm run build
```

---

### Environment variables not working in production

**Cause:** Not set in Vercel/deployment platform.

**Solution:**

1. Go to Vercel → Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

---

## 🔍 Testing Issues

### Test vendor not working

**Solution:**

Run complete setup:

```sql
-- Create vendor
INSERT INTO vendors (id, user_id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Test Vendor'
)
ON CONFLICT (id) DO UPDATE SET name = 'Test Vendor';

-- Fix RLS
DROP POLICY IF EXISTS "Vendors can insert own tasks" ON tasks;
CREATE POLICY "Vendors can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (vendor_id IN (SELECT id FROM vendors));
```

---

### Cannot create tasks

**Check:**

1. Test vendor exists:
   ```sql
   SELECT * FROM vendors WHERE id = '00000000-0000-0000-0000-000000000001';
   ```

2. RLS policies allow it:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'tasks';
   ```

3. Handle exists:
   ```sql
   SELECT * FROM users_public WHERE handle = 'yourhandle';
   ```

---

## 🐛 Common Errors Reference

### "Invalid API key"
→ Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "Failed to create handle"
→ Handle already exists or RLS blocking

### "Task not found"
→ Task doesn't exist or wrong vendor_id

### "Cannot read properties of null"
→ Missing data from database query

### "CORS error"
→ Wrong Supabase URL or API configuration

---

## 📞 Getting Help

If you're still stuck:

1. **Check Browser Console** (F12) for errors
2. **Check Supabase Logs** in Dashboard
3. **Verify SQL ran successfully** in SQL Editor
4. **Test with simple queries** to isolate the issue

---

## 🔧 Quick Fixes Checklist

Before asking for help, try these:

- [ ] Restart dev server (`npm run dev`)
- [ ] Clear browser cache
- [ ] Check `.env.local` exists and is correct
- [ ] Verify database schema is complete
- [ ] Check RLS policies are set up
- [ ] Test vendor exists in database
- [ ] Supabase project is not paused
- [ ] API keys are not expired

---

## 🎯 Quick Test Commands

```sql
-- Test database connection
SELECT NOW();

-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verify test vendor
SELECT * FROM vendors WHERE id = '00000000-0000-0000-0000-000000000001';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('tasks', 'updates', 'vendors', 'users_public');

-- Test handle search
SELECT * FROM users_public LIMIT 5;

-- Test task creation
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;
```

---

**Most issues are RLS-related. When in doubt, check your policies!**

