# 🏢 Vendor System - Project Nile

## 📋 Understanding Vendors

### What is a Vendor?

A **vendor** is a service provider who creates tasks and sends updates to customers. Each vendor has:
- **vendor_id** (UUID) - Unique vendor identifier
- **user_id** (UUID) - Links to authenticated user in `auth.users`
- **name** (TEXT) - Vendor business name

---

## 🔑 Vendor ID vs User ID

### The Relationship

```sql
vendors table:
├─ id (vendor_id)        → Used to track which vendor owns a task
└─ user_id               → Links to auth.users for authentication
```

### Why Two IDs?

**user_id** (from Supabase Auth):
- Created when vendor signs in with Google/Email
- Used for authentication
- Links to `auth.users` table

**vendor_id** (from vendors table):
- Created when vendor profile is made
- Used for business operations
- Links tasks to the vendor

**Example:**
```
User signs in → user_id: abc-123
                    ↓
Vendor profile created → vendor_id: def-456
                              ↓
Tasks created → vendor_id: def-456
                    ↓
All tasks by this vendor have same vendor_id
```

---

## 🧪 Test Vendor Setup

### For Quick Testing (No Auth)

```sql
-- Single consistent vendor for all test tasks
INSERT INTO vendors (id, user_id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- vendor_id
  '11111111-1111-1111-1111-111111111111',  -- user_id
  'Test Vendor'
);
```

**Benefits:**
- ✅ All test tasks have same vendor_id
- ✅ Easy to query: `WHERE vendor_id = '00000000-0000-0000-0000-000000000001'`
- ✅ Consistent user_id for tracking
- ✅ No authentication needed

---

## 🔐 Production Vendor Setup

### Automatic Creation (When User Signs In)

In `/dashboard/page.tsx`:

```typescript
const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Check if vendor profile exists
    let { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)  // Match auth user_id
      .single()
    
    // Create vendor profile if doesn't exist
    if (!vendor) {
      const { data: newVendor } = await supabase
        .from('vendors')
        .insert({ 
          user_id: user.id,      // From auth
          name: user.email 
        })
        .select('id')
        .single()
      
      vendor = newVendor
    }
    
    // Use vendor.id for all operations
    setVendorId(vendor.id)
  }
}
```

---

## 📊 Data Flow

### Task Creation Flow

```
1. Vendor signs in
   → user_id from auth.users

2. Vendor profile loaded/created
   → vendor_id from vendors table

3. Vendor creates task
   → task.vendor_id = vendor_id
   → task.user_handle = customer handle

4. Customer views tasks
   → Query: WHERE user_handle = 'john'
   → All tasks for that customer
```

### Multi-Vendor System

```sql
-- Each vendor has unique IDs
Vendor A:
  user_id: aaa-111
  vendor_id: vendor-aaa
  
Vendor B:
  user_id: bbb-222
  vendor_id: vendor-bbb

-- Tasks are isolated by vendor_id
Vendor A's tasks: WHERE vendor_id = 'vendor-aaa'
Vendor B's tasks: WHERE vendor_id = 'vendor-bbb'
```

---

## 🔒 Security with RLS

### Original (Strict - Requires Auth)

```sql
-- Only allow if user is authenticated and matches
CREATE POLICY "Vendors can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM vendors WHERE id = vendor_id
    )
  );
```

### Modified (Permissive - For Testing)

```sql
-- Allow if vendor exists (no auth check)
CREATE POLICY "Vendors can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    vendor_id IN (SELECT id FROM vendors)
  );
```

---

## 🎯 Best Practices

### Development
- Use test vendor with fixed vendor_id
- Bypass auth for faster iteration
- Clear test data regularly

### Production
- One vendor profile per authenticated user
- RLS policies enforce isolation
- Vendors can only see their own tasks

### Data Integrity
- Always use vendor_id from vendors table
- Never hardcode vendor IDs in production
- Validate vendor exists before creating tasks

---

## 🔍 Querying Vendor Data

### Get All Tasks for a Vendor

```sql
SELECT * FROM tasks 
WHERE vendor_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;
```

### Get Vendor Info

```sql
SELECT 
  v.name,
  COUNT(t.id) as task_count
FROM vendors v
LEFT JOIN tasks t ON t.vendor_id = v.id
WHERE v.id = '00000000-0000-0000-0000-000000000001'
GROUP BY v.id, v.name;
```

### Get Vendor's Customer List

```sql
SELECT DISTINCT 
  user_handle,
  COUNT(id) as task_count
FROM tasks
WHERE vendor_id = '00000000-0000-0000-0000-000000000001'
GROUP BY user_handle
ORDER BY task_count DESC;
```

---

## 📈 Scaling Considerations

### Current System
- ✅ Single vendor: test mode
- ✅ One vendor_id for all test tasks
- ✅ Easy to manage

### Future Multi-Vendor
- Each authenticated user → unique vendor
- Vendor teams (multiple users → one vendor)
- Vendor permissions/roles
- Vendor analytics

---

## 🎯 Summary

**Key Points:**
- ✅ **vendor_id** is used to track task ownership
- ✅ **user_id** links to authentication
- ✅ Test vendor has fixed IDs for consistency
- ✅ Production vendors auto-created on sign-in
- ✅ RLS policies enforce data isolation

**For Testing:**
```
vendor_id: 00000000-0000-0000-0000-000000000001
user_id:   11111111-1111-1111-1111-111111111111
```

**For Production:**
```
vendor_id: Auto-generated UUID
user_id:   From auth.users (Google/Email login)
```

---

**🏢 Vendor system explained - now you understand the architecture!**

