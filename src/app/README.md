# 🚀 Project Nile - Setup Instructions

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18+ installed

## 🛠️ Setup Steps

### 1. Install Dependencies

```bash
cd nile
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the schema from `supabase/schema.sql`
4. Enable **Realtime** for the `updates` table:
   - Go to Database → Replication
   - Enable replication for `updates` table

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in Supabase → Settings → API

### 4. Configure Authentication

1. Go to Supabase → Authentication → Providers
2. Enable **Google OAuth**:
   - Add your authorized domains
   - Configure OAuth callback URL: `http://localhost:3000/dashboard`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Vendors:
1. Visit `/dashboard`
2. Sign in with Google
3. Create tasks for customers
4. Add updates to tasks

### For Customers:
1. Visit `/@yourhandle`
2. View real-time updates (no login required)

## 🏗️ Project Structure

```
nile/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Vendor dashboard
│   │   ├── @[handle]/          # Public user feed
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   └── features/           # Business logic components
│   ├── lib/
│   │   ├── supabase/          # Supabase client
│   │   └── utils/             # Utility functions
│   └── types/                  # TypeScript types
└── supabase/
    └── schema.sql              # Database schema
```

## 🎨 Design System

- **Colors**: Navy (#0F172A) + Orange (#F97316)
- **Typography**: Inter font family
- **Components**: Modular, mobile-first design
- **Animations**: Smooth transitions with Tailwind

## 🔒 Security

- Row Level Security (RLS) enabled
- Vendors can only access their own tasks
- Public read access for user feeds
- OAuth authentication for vendors

## 📱 Features

✅ Real-time updates via Supabase Realtime
✅ Mobile-first responsive design
✅ Task management for vendors
✅ Public user feed (no login required)
✅ Multiple task types with icons
✅ Update timeline with timestamps
✅ Beautiful UI with modern design

## 🚀 Deployment

### Deploy to Vercel:

```bash
npm run build
```

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Update OAuth callback URLs in Supabase for production domain.

