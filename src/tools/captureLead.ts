import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

export async function captureLead(params: { name: string; phone: string; email?: string; niche?: string; notes?: string }, userId?: string) {
  console.log(`[Tool: captureLead] Executing with params:`, params);
  
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.warn("Supabase URL or Key not configured, skipping DB insert.");
    return { status: "success", message: "Mock lead captured (Config missing)." };
  }

  const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey || config.supabase.anonKey);

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      user_id: userId,
      name: params.name,
      phone: params.phone,
      email: params.email,
      niche: params.niche,
      notes: params.notes,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error("Error capturing lead:", error);
    throw new Error(`Failed to capture lead: ${error.message}`);
  }

  return { status: "success", data };
}
