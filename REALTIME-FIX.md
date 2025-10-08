# ⚡ Supabase Realtime WebSocket Fix

## ❌ Problem: WebSocket connection failed

**Error:** `WebSocket connection to 'wss://...supabase.co/realtime/v1/websocket' failed`

---

## ✅ SOLUTIONS

### Solution 1: Enable Realtime in Supabase (Most Common)

#### Step 1: Check if Realtime is Enabled

1. Go to Supabase Dashboard
2. Click **Database** → **Replication** (in sidebar)
3. Look for `updates` table
4. Check if "Realtime" is toggled ON

#### Step 2: Enable Realtime

If not enabled:
1. Find `updates` table in the list
2. Toggle **ON** the Realtime switch
3. Wait a few seconds
4. Refresh your Vercel app

---

### Solution 2: Run SQL to Enable Realtime

If you don't see the Replication page, run this SQL:

```sql
-- Enable Realtime for updates table
ALTER PUBLICATION supabase_realtime ADD TABLE updates;

-- Verify it worked
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

---

### Solution 3: Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check if project is **Active** (not paused)
3. Check if you're on Free tier with limits
4. Verify database is accessible

---

### Solution 4: Fallback - Disable Realtime Temporarily

If Realtime continues to fail, you can disable it temporarily:

**In your pages, comment out the realtime subscription:**

```typescript
// Temporarily disable realtime
// const subscribeToUpdates = useCallback(() => {
//   const channel = supabase.channel('public-updates')
//   ...
// }, [])

// Instead, use polling:
useEffect(() => {
  const interval = setInterval(() => {
    loadUserFeed() // Refresh every 5 seconds
  }, 5000)
  
  return () => clearInterval(interval)
}, [])
```

---

## 🔍 Debugging Steps

### Check 1: Supabase Project URL Correct?

In Vercel environment variables:
```
NEXT_PUBLIC_SUPABASE_URL = https://zyfpfnujfvdbpnkzphos.supabase.co
```

Should match your Supabase project URL exactly!

### Check 2: API Key Valid?

```
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
```

- Should be very long (200+ characters)
- Should start with `eyJ`
- Should be the `anon` key, not `service_role`

### Check 3: Supabase Free Tier Limits?

Free tier includes:
- ✅ 2GB database
- ✅ 50,000 monthly active users
- ⚠️ 200 concurrent Realtime connections

If you hit limits, upgrade or reduce connections.

---

## 🔧 Alternative: Use Polling Instead of Realtime

If Realtime is problematic, use polling for updates:

### Update `src/app/[handle]/page.tsx`:

```typescript
// Replace realtime subscription with polling
useEffect(() => {
  loadUserFeed() // Initial load
  
  // Poll every 3 seconds
  const interval = setInterval(() => {
    loadUserFeed()
  }, 3000)
  
  return () => clearInterval(interval)
}, [handle])

// Remove subscribeToUpdates() call
```

**Pros:**
- ✅ Always works
- ✅ No WebSocket issues
- ✅ Simple implementation

**Cons:**
- ⚠️ Slightly slower (3s vs instant)
- ⚠️ More database queries

---

## 🎯 Most Likely Fix

**90% of the time, it's one of these:**

1. **Realtime not enabled** in Supabase
   → Go to Database → Replication → Toggle ON

2. **Wrong Supabase URL** in Vercel
   → Check environment variables match exactly

3. **Supabase project paused**
   → Unpause in Supabase dashboard

---

## ✅ Quick Test

After fixing, test Realtime:

1. Open `/dashboard-test` in one tab
2. Open `/demo` (or any handle) in another tab
3. Create an update in dashboard
4. Should appear in 1-2 seconds on handle page
5. Check browser console for WebSocket connection

---

## 📊 Realtime Status Check

Run this in Supabase SQL Editor:

```sql
-- Check if Realtime is configured
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Should show 'updates' table
```

---

## 🔄 If All Else Fails

**Option 1:** Use polling (see above)

**Option 2:** Contact Supabase support
- Check their status page
- Open support ticket
- Check community forums

**Option 3:** Restart Supabase project
- Sometimes a restart fixes WebSocket issues

---

## 📝 Summary

**Most common fix:**
```
Supabase → Database → Replication → Toggle ON for 'updates' table
```

**Alternative:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE updates;
```

**Last resort:**
```
Use polling instead of WebSocket (3-second refresh)
```

---

**⚡ Realtime should work after enabling in Supabase!** 🚀
