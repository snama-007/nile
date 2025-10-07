-- Complete test vendor setup
-- Run this in Supabase SQL Editor to set up testing without authentication

-- 1. Create a test vendor with a consistent user_id
-- All tasks created by this vendor will have the same vendor_id
INSERT INTO vendors (id, user_id, name)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- vendor_id
  '11111111-1111-1111-1111-111111111111', -- user_id (consistent)
  'Test Vendor'
)
ON CONFLICT (id) DO UPDATE SET 
  user_id = '11111111-1111-1111-1111-111111111111',
  name = 'Test Vendor';

-- 3. Verify vendor was created
SELECT * FROM vendors WHERE id = '00000000-0000-0000-0000-000000000001';

-- 4. Create a test handle for demo purposes
INSERT INTO users_public (handle, name)
VALUES ('demo', 'Demo User')
ON CONFLICT (handle) DO UPDATE SET name = 'Demo User';

-- 5. Create a test task (to verify RLS is working)
INSERT INTO tasks (title, description, user_handle, vendor_id, task_type, status)
VALUES (
  'Test Task',
  'This is a test task to verify the system works',
  'demo',
  '00000000-0000-0000-0000-000000000001',
  'info',
  'created'
)
RETURNING id, title, user_handle;

-- 6. Add a test update
INSERT INTO updates (task_id, message)
SELECT id, 'Test update - system is working!' 
FROM tasks 
WHERE vendor_id = '00000000-0000-0000-0000-000000000001' 
LIMIT 1;

-- 7. Verify everything works
SELECT 
  t.title,
  t.user_handle,
  u.message,
  u.created_at
FROM tasks t
LEFT JOIN updates u ON u.task_id = t.id
WHERE t.vendor_id = '00000000-0000-0000-0000-000000000001'
ORDER BY u.created_at DESC;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Test vendor setup complete! Visit /dashboard-test to start testing.';
END $$;

