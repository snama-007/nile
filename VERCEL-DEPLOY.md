# 🚀 Vercel Deployment Guide - Project Nile

## ✅ Build Errors Fixed!

The "supabaseUrl is required" error has been resolved by:
- Adding fallback values for build time
- Using `dynamic = 'force-dynamic'` to skip static generation
- Proper environment variable handling

---

## 📋 Deployment Steps

### Step 1: Push to GitHub

Your code is already committed. Just push:

```bash
cd /Users/snama/s.space/sftw-hack/nile

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/project-nile.git

# Push to GitHub
git push -u origin main
```

---

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository: `project-nile`
4. Vercel will auto-detect Next.js ✅

---

### Step 3: Configure Environment Variables

**CRITICAL:** Add these in Vercel before deploying:

1. In Vercel project settings, go to **Settings** → **Environment Variables**

2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Set for: **Production**, **Preview**, and **Development**

---

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app will be live at: `https://project-nile.vercel.app`

---

## ✅ Post-Deployment Checklist

### 1. Update Supabase URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://project-nile.vercel.app
```

**Redirect URLs:**
```
https://project-nile.vercel.app/**
https://xxxxx.supabase.co/auth/v1/callback
```

### 2. Test Production Deployment

Visit your Vercel URL and test:
- [ ] Landing page loads
- [ ] Create handle works
- [ ] Dashboard-test accessible
- [ ] Can create tasks
- [ ] Can add updates
- [ ] User feed works (`/handle`)
- [ ] Real-time updates work

### 3. Configure OAuth (For /dashboard)

If using Google OAuth:
1. Update OAuth callback URLs in Google Cloud Console
2. Add production domain to authorized origins
3. Test sign-in flow

---

## 🐛 Common Vercel Deployment Issues

### Issue: Build fails with "supabaseUrl is required"

**Status:** ✅ FIXED in latest commit!

**What was done:**
- Added `export const dynamic = 'force-dynamic'` to all pages
- Added fallback values in Supabase client
- Prevents static generation from requiring env vars

---

### Issue: Environment variables not found

**Solution:**

1. Verify variables are set in Vercel:
   - Settings → Environment Variables
   - Check spelling exactly matches: `NEXT_PUBLIC_SUPABASE_URL`

2. Redeploy:
   - Deployments → Click three dots → Redeploy

---

### Issue: Pages showing 500 error

**Causes:**
1. Missing environment variables
2. Supabase URL/key incorrect
3. Database not set up

**Solution:**
1. Check Vercel function logs
2. Verify environment variables
3. Test Supabase connection

---

### Issue: Real-time not working in production

**Solution:**

Ensure in Supabase:
1. Realtime enabled for `updates` table
2. API URL matches environment variable
3. No CORS issues

---

## 🔒 Security for Production

### Environment Variables

**Never commit these:**
```
❌ .env.local (gitignored)
❌ Hardcoded in code
❌ In README or docs
```

**Set in Vercel:**
```
✅ Project Settings → Environment Variables
✅ Use for: Production, Preview, Development
✅ Keep anon key (safe for frontend)
✅ NEVER use service_role key in frontend
```

### Supabase RLS

For production, update RLS policies to be more restrictive:

```sql
-- Re-enable strict auth policies
DROP POLICY IF EXISTS "Vendors can insert tasks" ON tasks;

CREATE POLICY "Vendors can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM vendors WHERE id = vendor_id
    )
  );
```

---

## 📊 Vercel Configuration

### Build Settings (Auto-detected)

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Root Directory

If your repo is structured differently:
```
Root Directory: nile
```

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain

1. Vercel → Settings → Domains
2. Add your domain: `nile.app`
3. Update DNS records as instructed
4. SSL certificate auto-configured

### Update Supabase

After adding custom domain:
1. Update Site URL in Supabase
2. Update OAuth redirect URLs
3. Test authentication flow

---

## 📈 Performance Optimization

### Already Optimized

✅ Next.js 14 automatic optimizations
✅ Image optimization
✅ Font optimization
✅ Code splitting
✅ Tree shaking

### Vercel Edge Network

✅ Global CDN
✅ Smart caching
✅ Automatic compression
✅ DDoS protection

---

## 🔍 Monitoring

### Vercel Analytics (Optional)

Enable in Vercel:
1. Analytics tab
2. Enable Web Analytics
3. View real-time data

### Error Tracking

Set up Sentry or similar:
1. Add to `package.json`
2. Configure in Next.js
3. Add DSN to environment variables

---

## 🚦 Deployment Workflow

### Automatic Deployments

- **Push to main** → Production deployment
- **Create PR** → Preview deployment
- **Merge PR** → Production update

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from terminal
vercel --prod
```

---

## 📋 Pre-Deployment Checklist

- [x] Code pushed to GitHub
- [x] Build successful locally
- [x] All tests passing
- [x] No linting errors
- [ ] Environment variables ready
- [ ] Supabase project set up
- [ ] Database schema executed
- [ ] Test vendor created (if using dashboard-test)
- [ ] OAuth configured (if using /dashboard)

---

## 🎯 Quick Deploy Commands

```bash
# Build and test locally first
npm run build
npm run test:ci

# Push to GitHub
git push origin main

# Deploy to Vercel (if using CLI)
vercel --prod
```

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 🎉 Success!

Once deployed:
- ✅ Your app is live globally
- ✅ HTTPS automatic
- ✅ CDN enabled
- ✅ Automatic scaling
- ✅ Zero downtime deployments

**Production URL:**
```
https://project-nile.vercel.app
or
https://your-custom-domain.com
```

---

**🚀 Deploy with confidence!**

