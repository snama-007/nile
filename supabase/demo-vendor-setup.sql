-- Demo Vendor Setup for Project Nile
-- This creates a realistic demo vendor for testing

-- ========================================
-- STEP 1: Disable RLS for Testing
-- ========================================

ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_public DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE updates DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Create Demo Vendor
-- ========================================

-- Realistic vendor with proper UUIDs
INSERT INTO vendors (id, user_id, name)
VALUES (
  'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b', -- Demo vendor ID (valid UUID)
  'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', -- Demo user ID (valid UUID)
  'Demo Service Provider'
)
ON CONFLICT (id) DO UPDATE SET 
  user_id = 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  name = 'Demo Service Provider';

-- ========================================
-- STEP 3: Create Sample Customer Handles
-- ========================================

INSERT INTO users_public (handle, name)
VALUES 
  ('demo', 'Demo Customer'),
  ('john', 'John Smith'),
  ('sarah', 'Sarah Johnson'),
  ('mike', 'Mike Williams'),
  ('emma', 'Emma Davis')
ON CONFLICT (handle) DO UPDATE SET name = EXCLUDED.name;

-- ========================================
-- STEP 4: Create Sample Tasks
-- ========================================

-- Sample task 1: Pet grooming
INSERT INTO tasks (title, description, user_handle, vendor_id, task_type, status)
VALUES (
  'Bella''s Grooming Appointment',
  'Standard grooming package with nail trim and ear cleaning',
  'demo',
  'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b',
  'info',
  'active'
);

-- Sample task 2: Car service
INSERT INTO tasks (title, description, user_handle, vendor_id, task_type, status)
VALUES (
  'Car Oil Change Service',
  'Regular maintenance - oil change and filter replacement',
  'john',
  'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b',
  'action',
  'active'
);

-- ========================================
-- STEP 5: Add Sample Updates
-- ========================================

-- Add updates to sample tasks
INSERT INTO updates (task_id, message)
SELECT id, 'Your appointment has been confirmed. See you tomorrow at 10 AM!' 
FROM tasks 
WHERE user_handle = 'demo' AND vendor_id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b'
LIMIT 1;

INSERT INTO updates (task_id, message)
SELECT id, 'Vehicle has been checked in. Starting oil change now.' 
FROM tasks 
WHERE user_handle = 'john' AND vendor_id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b'
LIMIT 1;

-- ========================================
-- STEP 6: Verify Setup
-- ========================================

-- Check vendor
SELECT 'Demo Vendor Created:' as status, id, name FROM vendors 
WHERE id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';

-- Check handles
SELECT 'Customer Handles:' as status, handle, name FROM users_public ORDER BY handle;

-- Check tasks
SELECT 'Sample Tasks:' as status, title, user_handle FROM tasks 
WHERE vendor_id = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';

-- Check updates
SELECT 'Sample Updates:' as status, COUNT(*) FROM updates;

-- Check RLS status
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '❌ ENABLED (will block inserts)'
    ELSE '✅ DISABLED (ready for testing)'
  END as status
FROM pg_tables 
WHERE tablename IN ('vendors', 'users_public', 'tasks', 'updates')
  AND schemaname = 'public';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Demo vendor setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Demo Vendor: "Demo Service Provider"';
  RAISE NOTICE '🆔 Vendor ID: b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Try these:';
  RAISE NOTICE '   • Visit /dashboard-test to create tasks';
  RAISE NOTICE '   • Visit /demo to see sample task';
  RAISE NOTICE '   • Visit /john to see car service task';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test real-time updates!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Remember: RLS is DISABLED for testing';
  RAISE NOTICE '    Run enable-rls-production.sql before going live!';
END $$;

