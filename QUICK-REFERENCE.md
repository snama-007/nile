# ⚡ Quick Reference - Project Nile

## 🎯 Super Fast Setup (3 Steps)

### 1. Supabase Setup
```sql
-- Run schema.sql in Supabase SQL Editor
-- Then run this:
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_public DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE updates DISABLE ROW LEVEL SECURITY;
```

### 2. Environment
```bash
# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-key
```

### 3. Run
```bash
npm run dev
```

**Done!** Visit http://localhost:3000 ✅

---

## 📍 Routes

| URL | Purpose | Auth Required |
|-----|---------|---------------|
| `/` | Landing page | No |
| `/dashboard-test` | Vendor portal (test) | No |
| `/dashboard` | Vendor portal (prod) | Yes |
| `/[handle]` | Customer feed | No |

---

## 🔑 Key Concepts

### Handle System
- Customer creates handle (e.g., `john`)
- Gets URL: `/john`
- Vendor searches for `john`
- Creates tasks for `john`
- Updates appear at `/john` in real-time

### Vendor System
- Test Vendor ID: `00000000-0000-0000-0000-000000000001`
- Auto-created on first `/dashboard-test` visit
- All test tasks use this vendor_id

---

## 🧪 Quick Test

```bash
# 1. Create handle
Visit: /
Click: "Create My Personal Handle"
Enter: alice

# 2. Create task
Visit: /dashboard-test
Search: alice
Create task: "Test Task"

# 3. See it live
Visit: /alice
✅ Task appears!

# 4. Add update
Dashboard: Click "+ Add Update"
Type: "Update message"
✅ Appears instantly on /alice
```

---

## 🐛 Common Issues

### RLS Error
```sql
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE updates DISABLE ROW LEVEL SECURITY;
```

### Connection Error
Check `.env.local` has correct URL and key

### Vendor Not Found
Refresh `/dashboard-test` page

---

## 📦 Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```

---

## 🚀 Deploy

```bash
git push origin main        # Push to GitHub
# Import to Vercel
# Add env vars
# Deploy!
```

---

## 📚 Full Docs

- **START-HERE.md** - Navigation
- **FINAL-SETUP-GUIDE.md** - 5-min setup
- **TROUBLESHOOTING.md** - Help

---

**That's it! Simple and fast.** ⚡

