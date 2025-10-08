-- Complete Test Setup for Project Nile
-- This allows testing without authentication while maintaining data integrity
-- Run this entire script in Supabase SQL Editor

-- ========================================
-- STEP 1: Temporarily disable RLS for testing
-- ========================================
-- This is the easiest way to test without authentication
-- Re-enable for production!

ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_public DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE updates DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Create Test Vendor
-- ========================================

INSERT INTO vendors (id, user_id, name)
VALUES (
  'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b',
  'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  'Demo Service Provider'
)
ON CONFLICT (id) DO UPDATE SET 
  user_id = 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  name = 'Demo Service Provider';

-- ========================================
-- STEP 3: Create Test Handles
-- ========================================

INSERT INTO users_public (handle, name)
VALUES 
  ('demo', 'Demo User'),
  ('john', 'John Doe'),
  ('jane', 'Jane Smith')
ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name;

-- ========================================
-- STEP 4: Create Sample Task (Optional)
-- ========================================

INSERT INTO tasks (title, description, user_handle, vendor_id, task_type, status)
VALUES (
  'Welcome to Nile!',
  'This is a sample task to show how the system works',
  'demo',
  '00000000-0000-0000-0000-000000000001',
  'info',
  'created'
)
ON CONFLICT DO NOTHING
RETURNING id, title, user_handle;

-- ========================================
-- STEP 5: Add Sample Update (Optional)
-- ========================================

INSERT INTO updates (task_id, message)
SELECT id, 'System is working! You can now create tasks and updates.' 
FROM tasks 
WHERE vendor_id = '00000000-0000-0000-0000-000000000001' 
  AND user_handle = 'demo'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ========================================
-- STEP 6: Verify Setup
-- ========================================

-- Check vendor exists
SELECT 'Vendor Created:' as status, * FROM vendors 
WHERE id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';

-- Check handles exist
SELECT 'Handles Created:' as status, * FROM users_public LIMIT 5;

-- Check tasks (if any)
SELECT 'Tasks:' as status, COUNT(*) as count FROM tasks 
WHERE vendor_id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN 'ENABLED ⚠️ (may block inserts)'
    ELSE 'DISABLED ✅ (testing mode)'
  END as rls_status
FROM pg_tables 
WHERE tablename IN ('vendors', 'users_public', 'tasks', 'updates')
  AND schemaname = 'public';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Demo vendor setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Demo Vendor: Demo Service Provider';
  RAISE NOTICE 'Vendor ID: b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';
  RAISE NOTICE 'Sample Handles: demo, john, jane';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 You can now:';
  RAISE NOTICE '1. Visit /dashboard-test to create tasks';
  RAISE NOTICE '2. Visit /demo to see the sample task';
  RAISE NOTICE '3. Create more tasks and see real-time updates!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  RLS is DISABLED for testing';
  RAISE NOTICE '    Re-enable before production!';
END $$;

-- ========================================
-- TO RE-ENABLE RLS FOR PRODUCTION:
-- ========================================
-- Uncomment and run these before going live:

-- ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

