# 🚀 Project Nile - Quick Start Guide

## ⚡ 45-Minute MVP Setup

### Step 1: Install Dependencies (2 min)
```bash
cd nile
npm install
```

### Step 2: Set Up Supabase (5 min)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name it "project-nile"

2. **Run Database Schema**:
   - Open Supabase Dashboard → SQL Editor
   - Copy contents from `supabase/schema.sql`
   - Run the SQL script
   - **Note**: Realtime is now automatically enabled in the schema with `ALTER PUBLICATION supabase_realtime ADD TABLE updates;`

### Step 3: Configure Environment (2 min)

Create `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase → Settings → API

### Step 4: Fix RLS & Create Test Vendor (2 min)

**Run this SQL in Supabase SQL Editor** to allow testing without auth:

```sql
-- Fix RLS policies for testing
DROP POLICY IF EXISTS "Vendors can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Vendors can insert updates for own tasks" ON updates;

CREATE POLICY "Vendors can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (vendor_id IN (SELECT id FROM vendors));

CREATE POLICY "Vendors can insert updates"
  ON updates FOR INSERT
  WITH CHECK (task_id IN (SELECT t.id FROM tasks t JOIN vendors v ON t.vendor_id = v.id));

-- Create test vendor
INSERT INTO vendors (id, user_id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Test Vendor'
)
ON CONFLICT (id) DO UPDATE SET name = 'Test Vendor';
```

✅ Now `/dashboard-test` will work without authentication!

### Step 5: Set Up Authentication (Optional - For Production)

**For Development (Quick Test)**:
- Auth is already configured for testing
- You'll need to set up OAuth for production

**For Production (Google OAuth)**:
1. Supabase → Authentication → Providers
2. Enable Google OAuth
3. Add OAuth credentials from Google Cloud Console
4. Add authorized domains
5. See `SUPABASE-SETUP.md` for details

### Step 6: Run the App (1 min)
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Testing the App

### How It Works:
1. **Vendor** assigns a unique **handle** to each customer (e.g., `@john`)
2. **Customer** visits their handle URL to see tasks (`/john` or `/@john`)
3. **Vendor** creates tasks and updates for that handle
4. **Customer** receives updates in real-time - no login needed!

### Test Vendor Flow (Quick - No Auth):
1. Go to `/dashboard-test` (no sign-in needed!)
2. Create a task:
   - **Handle**: `john` (customer's unique identifier)
   - **Title**: "Car Service Update"
   - **Type**: "Info"
   - **Description**: "Your car is ready"
4. Share the link `/john` with your customer
5. Add updates to the task - customer sees them instantly!

### Test User Flow:
1. Customer visits `/john` (or `/@john`)
2. Sees all tasks assigned to handle "john"
3. Add an update from `/dashboard-test`
4. Watch it appear instantly on `/john` - real-time! ⚡
5. No login required for customers!

---

## 📁 Project Structure

```
nile/
├── src/
│   ├── app/
│   │   ├── dashboard/         # Vendor dashboard
│   │   ├── @[handle]/         # Public feed (@username)
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   └── features/          # Business components
│   │       ├── CreateTaskForm.tsx
│   │       ├── TaskCard.tsx
│   │       ├── TaskList.tsx
│   │       └── UpdateTimeline.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   └── utils/
│   │       ├── task-types.ts
│   │       └── date.ts
│   └── types/
│       └── database.types.ts
└── supabase/
    └── schema.sql
```

---

## 🎨 Design System

### Colors
- **Navy**: `#0F172A` (Primary dark)
- **Orange**: `#F97316` (Brand accent)
- **Backgrounds**: `#F8FAFC` (Light gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 2xl-4xl
- **Body**: Regular, base

### Components
- Rounded corners: `rounded-xl`
- Shadows: `shadow-md`, `shadow-lg`
- Transitions: `duration-200`

---

## 🔥 Key Features

✅ **Real-time Updates**: Supabase Realtime channels  
✅ **Mobile-First**: Responsive design with Tailwind  
✅ **Type-Safe**: Full TypeScript coverage  
✅ **Modular**: Clean component architecture  
✅ **Secure**: Row-level security with RLS  
✅ **Fast**: Optimized for performance  
✅ **Beautiful**: Modern UI with smooth animations  

---

## 🐛 Troubleshooting

### "Invalid API key"
→ Check `.env.local` has correct Supabase URL and key

### "Failed to create task"
→ Ensure database schema is fully executed

### "Google sign-in not working"
→ Configure OAuth in Supabase Auth settings

### Updates not appearing in real-time
→ Enable Realtime replication for `updates` table

---

## 🚀 Deployment

### Deploy to Vercel (5 min)

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

### Post-Deployment:
- Update OAuth callback URLs in Supabase
- Add production domain to authorized domains

---

## 📚 Next Steps

- [ ] Add email notifications
- [ ] Implement task search/filtering
- [ ] Add user avatars
- [ ] Create task templates
- [ ] Add analytics dashboard
- [ ] Implement SMS notifications

---

## 💡 Tips

- Use `@handle` format for clean URLs
- Task types have emoji icons (✅ 💳 ⚡ etc)
- Updates appear in real-time (< 1 second)
- Mobile-first design works on all devices

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**

