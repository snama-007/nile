-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public users table
CREATE TABLE users_public (
  handle TEXT PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_handle TEXT REFERENCES users_public(handle) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  task_type TEXT CHECK (task_type IN ('info', 'action', 'payment', 'reminder', 'approval', 'handoff', 'confirm', 'warning', 'complete')) NOT NULL,
  status TEXT DEFAULT 'created',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updates table
CREATE TABLE updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_vendor_id ON tasks(vendor_id);
CREATE INDEX idx_tasks_user_handle ON tasks(user_handle);
CREATE INDEX idx_updates_task_id ON updates(task_id);
CREATE INDEX idx_updates_created_at ON updates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors
CREATE POLICY "Vendors can read own profile"
  ON vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert own profile"
  ON vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for users_public
CREATE POLICY "Anyone can read public users"
  ON users_public FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert public users"
  ON users_public FOR INSERT
  WITH CHECK (true);

-- RLS Policies for tasks
CREATE POLICY "Vendors can read own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM vendors WHERE id = vendor_id));

CREATE POLICY "Public can read tasks by handle"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Vendors can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM vendors WHERE id = vendor_id));

CREATE POLICY "Vendors can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM vendors WHERE id = vendor_id));

-- RLS Policies for updates
CREATE POLICY "Public can read updates"
  ON updates FOR SELECT
  USING (true);

CREATE POLICY "Vendors can insert updates for own tasks"
  ON updates FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT v.user_id FROM vendors v
      JOIN tasks t ON t.vendor_id = v.id
      WHERE t.id = task_id
    )
  );

-- Enable Realtime for updates table
-- This command enables real-time subscriptions via Postgres LISTEN/NOTIFY
-- Note: If you get an error about publication not existing, that's okay!
-- Realtime will still work through Supabase's realtime server
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE updates;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Publication doesn't exist in this version, realtime works differently
END $$;

