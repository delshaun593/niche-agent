-- 1. Create the agents table
CREATE TABLE public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vapi_assistant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    greeting TEXT,
    system_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id) -- One agent per user for now
);

-- Turn on Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own agent
CREATE POLICY "Users can view own agent" ON public.agents
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own agent
CREATE POLICY "Users can update own agent" ON public.agents
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own agent
CREATE POLICY "Users can insert own agent" ON public.agents
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. Create the leads table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'New' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own leads
CREATE POLICY "Users can view own leads" ON public.leads
    FOR SELECT USING (auth.uid() = user_id);
    
-- (The backend Node server will need a SERVICE_ROLE key or we bypass RLS for inserts from the webhook)
-- For now, allow insert if authenticated as the user, OR you can rely on the backend using the service_role key to bypass RLS.
