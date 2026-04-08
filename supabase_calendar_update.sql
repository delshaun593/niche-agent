-- Execute this in your Supabase SQL Editor to support Option B Calendar OAuth

-- Add google_refresh_token column to the agents table
ALTER TABLE public.agents 
ADD COLUMN google_refresh_token TEXT;

-- (Optional) If you want to force RLS policies to allow the backend to read it
-- This is already covered if you are using the serviceRoleKey in the backend!
