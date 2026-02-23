-- Supabase Schema for Universal Event Planning SaaS

-- Projects Table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  city TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  guest_count INTEGER DEFAULT 0,
  budget_target NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan_data JSONB -- Stores the full nested Plan object for UI compatibility
);

-- Functions Table
CREATE TABLE functions (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  function_date TIMESTAMP WITH TIME ZONE,
  guest_count INTEGER DEFAULT 0
);

-- Budget Line Items Table
CREATE TABLE budget_items (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  function_id TEXT REFERENCES functions(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  estimated_cost NUMERIC DEFAULT 0,
  actual_cost NUMERIC DEFAULT 0,
  side_assignment TEXT,
  notes TEXT
);

-- Vendors Table
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  function_id TEXT REFERENCES functions(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  category TEXT NOT NULL,
  cost NUMERIC DEFAULT 0,
  payment_status TEXT,
  contact_info TEXT,
  notes TEXT
);

-- Guests Table
CREATE TABLE guests (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  side TEXT,
  rsvp_status TEXT,
  notes TEXT
);

-- Checklist Tasks Table
CREATE TABLE checklist_tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  function_id TEXT REFERENCES functions(id) ON DELETE SET NULL,
  task_name TEXT NOT NULL,
  status TEXT,
  priority TEXT
);

-- Timeline Events Table
CREATE TABLE timeline_events (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  function_id TEXT REFERENCES functions(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  event_time TEXT,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Functions
CREATE POLICY "Users can view own functions" ON functions FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = functions.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own functions" ON functions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = functions.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own functions" ON functions FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = functions.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own functions" ON functions FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = functions.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Budget Items
CREATE POLICY "Users can view own budget items" ON budget_items FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own budget items" ON budget_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own budget items" ON budget_items FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own budget items" ON budget_items FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Vendors
CREATE POLICY "Users can view own vendors" ON vendors FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = vendors.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own vendors" ON vendors FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = vendors.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own vendors" ON vendors FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = vendors.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own vendors" ON vendors FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = vendors.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Guests
CREATE POLICY "Users can view own guests" ON guests FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = guests.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own guests" ON guests FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = guests.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own guests" ON guests FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = guests.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own guests" ON guests FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = guests.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Checklist Tasks
CREATE POLICY "Users can view own checklist tasks" ON checklist_tasks FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = checklist_tasks.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own checklist tasks" ON checklist_tasks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = checklist_tasks.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own checklist tasks" ON checklist_tasks FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = checklist_tasks.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own checklist tasks" ON checklist_tasks FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = checklist_tasks.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for Timeline Events
CREATE POLICY "Users can view own timeline events" ON timeline_events FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = timeline_events.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can insert own timeline events" ON timeline_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = timeline_events.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can update own timeline events" ON timeline_events FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = timeline_events.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can delete own timeline events" ON timeline_events FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = timeline_events.project_id AND projects.user_id = auth.uid()));
