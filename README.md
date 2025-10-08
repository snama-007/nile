# 🌊 Project Nile

**Real-time service task updates for the modern world**

A clean, minimal pub-sub system where service providers publish real-time updates to customers through public handles. No login required for customers.

---

## ✨ Features

- 🚀 **Real-time updates** - Instant task updates via Supabase Realtime
- 🎨 **Beautiful design** - Modern UI with navy blue + orange palette
- 📱 **Mobile-first** - Responsive design that works everywhere
- 🔒 **Secure** - Row-level security with Supabase
- ⚡ **Fast** - Optimized performance with Next.js 14
- 🎯 **Simple** - No login required for end-users

---

## 🎯 Use Cases

- 🐕 **Dog Groomers** - "Bella is ready for pickup!"
- 🔧 **Mechanics** - "Your car repair is 50% complete"
- 🍕 **Restaurants** - "Your order is out for delivery"
- 🏥 **Healthcare** - "Your appointment is confirmed"
- 📦 **Delivery** - "Package arriving in 10 minutes"

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Vendor Portal  │ ← Authenticated (Google OAuth)
│   /dashboard    │   - Create tasks
└────────┬────────┘   - Add updates
         │
         ↓
    ┌─────────┐
    │Supabase │ ← PostgreSQL + Realtime
    │         │   - Row Level Security
    └────┬────┘   - Pub/Sub channels
         │
         ↓
┌─────────────────┐
│  User Feed      │ ← Public (No login)
│  /@handle       │   - Real-time updates
└─────────────────┘   - Mobile-first UI
```

---

## 🚀 Quick Start

```bash
cd nile
npm install
```

See [QUICKSTART.md](./nile/QUICKSTART.md) for detailed setup.

---

## 📸 Screenshots

### Landing Page
Clean, minimal landing with clear CTAs

### Vendor Dashboard
- Create tasks for customers
- Add real-time updates
- Track all tasks

### Public Feed (`/@handle`)
- View tasks in real-time
- Timeline of updates
- No login required

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase |
| **Database** | PostgreSQL |
| **Auth** | Supabase Auth (OAuth) |
| **Realtime** | Supabase Channels |
| **Language** | TypeScript |
| **Deployment** | Vercel |

---

## 📦 Project Structure

```
nile/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable primitives
│   │   └── features/    # Business logic
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
└── supabase/
    └── schema.sql       # Database schema
```

---

## 🎨 Design System

### Colors
- **Primary**: Navy Blue (`#0F172A`)
- **Accent**: Orange (`#F97316`)
- **Background**: Slate (`#F8FAFC`)

### Typography
- **Font**: Inter
- **Scale**: Responsive (xs → 6xl)

### Components
- Modular, reusable design
- Consistent spacing & sizing
- Smooth animations

---

## 🔒 Security

- ✅ Row Level Security (RLS)
- ✅ Vendors can only access their tasks
- ✅ Public read access for user feeds
- ✅ OAuth authentication
- ✅ Environment variable protection

---

## 📱 Mobile First

- Responsive breakpoints
- Touch-friendly interactions
- Optimized for small screens
- Fast loading times

---

## 🧪 Testing

### Manual Testing
1. Create a task in dashboard
2. Visit `/@handle` in new tab
3. Add an update
4. Watch it appear in real-time!

---

## 🚀 Deployment

```bash
npm run build
```

Deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## 📄 License

MIT

---

## 👨‍💻 Author

Built as a 45-minute MVP showcase

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- Tailwind CSS for the design system

---

**🌊 Project Nile - Real-time updates, delivered beautifully**

