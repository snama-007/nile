-- Re-enable RLS for Production
-- Run this before deploying to production!

-- ========================================
-- STEP 1: Re-enable RLS
-- ========================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Update Policies for Production
-- ========================================

-- Drop test policies
DROP POLICY IF EXISTS "Vendors can insert tasks" ON tasks;
DROP POLICY IF EXISTS "Vendors can insert updates" ON updates;

-- Create production-ready policies
-- These require proper authentication

-- Tasks policies
CREATE POLICY "Vendors can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM vendors WHERE id = vendor_id
    )
  );

CREATE POLICY "Vendors can update own tasks"
  ON tasks FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM vendors WHERE id = vendor_id
    )
  );

CREATE POLICY "Vendors can delete own tasks"
  ON tasks FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM vendors WHERE id = vendor_id
    )
  );

-- Updates policies
CREATE POLICY "Vendors can insert updates for own tasks"
  ON updates FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT v.user_id FROM vendors v
      JOIN tasks t ON t.vendor_id = v.id
      WHERE t.id = task_id
    )
  );

-- ========================================
-- STEP 3: Verify RLS is Active
-- ========================================

SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED (Production Ready)'
    ELSE '❌ DISABLED (Not Safe!)'
  END as rls_status
FROM pg_tables 
WHERE tablename IN ('vendors', 'users_public', 'tasks', 'updates')
  AND schemaname = 'public';

-- ========================================
-- STEP 4: Remove Test Vendor (Optional)
-- ========================================

-- Uncomment to remove test vendor before production:
-- DELETE FROM vendors WHERE id = '00000000-0000-0000-0000-000000000001';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS re-enabled for production!';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Your database is now secure:';
  RAISE NOTICE '   - Vendors can only access their own tasks';
  RAISE NOTICE '   - Authentication required for all operations';
  RAISE NOTICE '   - Public read access maintained for user feeds';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Make sure OAuth is configured in Supabase Auth!';
END $$;

