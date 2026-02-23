-- Supabase Schema Definition for Universal Event Planning SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    city TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    guest_count INTEGER DEFAULT 0,
    budget_target NUMERIC DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb, -- Stores additional UI state (e.g., guestStats, giftConfig, pro modules)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Functions Table
CREATE TABLE IF NOT EXISTS functions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_name TEXT NOT NULL,
    function_date TIMESTAMP WITH TIME ZONE,
    guest_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Budget Line Items Table
CREATE TABLE IF NOT EXISTS budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_id UUID REFERENCES functions(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    estimated_cost NUMERIC DEFAULT 0,
    actual_cost NUMERIC DEFAULT 0,
    side_assignment TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_id UUID REFERENCES functions(id) ON DELETE SET NULL,
    vendor_name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost NUMERIC DEFAULT 0,
    payment_status TEXT,
    contact_info TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Guests Table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    side TEXT,
    rsvp_status TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Checklist Tasks Table
CREATE TABLE IF NOT EXISTS checklist_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_id UUID REFERENCES functions(id) ON DELETE SET NULL,
    task_name TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    priority TEXT DEFAULT 'MEDIUM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Timeline Events Table
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_id UUID REFERENCES functions(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    event_time TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Functions Policies
CREATE POLICY "Users can view own functions" ON functions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own functions" ON functions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own functions" ON functions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own functions" ON functions FOR DELETE USING (auth.uid() = user_id);

-- Budget Items Policies
CREATE POLICY "Users can view own budget items" ON budget_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget items" ON budget_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget items" ON budget_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget items" ON budget_items FOR DELETE USING (auth.uid() = user_id);

-- Vendors Policies
CREATE POLICY "Users can view own vendors" ON vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vendors" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vendors" ON vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vendors" ON vendors FOR DELETE USING (auth.uid() = user_id);

-- Guests Policies
CREATE POLICY "Users can view own guests" ON guests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own guests" ON guests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own guests" ON guests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own guests" ON guests FOR DELETE USING (auth.uid() = user_id);

-- Checklist Tasks Policies
CREATE POLICY "Users can view own checklist tasks" ON checklist_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklist tasks" ON checklist_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklist tasks" ON checklist_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklist tasks" ON checklist_tasks FOR DELETE USING (auth.uid() = user_id);

-- Timeline Events Policies
CREATE POLICY "Users can view own timeline events" ON timeline_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own timeline events" ON timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timeline events" ON timeline_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own timeline events" ON timeline_events FOR DELETE USING (auth.uid() = user_id);
