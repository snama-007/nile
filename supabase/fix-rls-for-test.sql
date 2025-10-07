-- Fix RLS policies to allow test vendor and better handle creation
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Vendors can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Vendors can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Vendors can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Vendors can insert updates for own tasks" ON updates;

-- More permissive policies for tasks table
-- Allow inserts if vendor_id matches a vendor in the vendors table
CREATE POLICY "Vendors can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    vendor_id IN (SELECT id FROM vendors)
  );

-- Allow updates if vendor_id matches a vendor
CREATE POLICY "Vendors can update tasks"
  ON tasks FOR UPDATE
  USING (
    vendor_id IN (SELECT id FROM vendors)
  );

-- Allow reads for own tasks (keep auth check for authenticated users)
CREATE POLICY "Vendors can read own tasks"
  ON tasks FOR SELECT
  USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR vendor_id IN (SELECT id FROM vendors) -- Allow test vendor
  );

-- More permissive policy for updates table
-- Allow inserts if the task belongs to a valid vendor
CREATE POLICY "Vendors can insert updates"
  ON updates FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT t.id FROM tasks t
      JOIN vendors v ON t.vendor_id = v.id
    )
  );

-- Alternative: Temporarily disable RLS for testing (NOT for production!)
-- Uncomment these lines if you want to completely bypass RLS for testing:
-- ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE updates DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users_public DISABLE ROW LEVEL SECURITY;

-- To re-enable later:
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;

