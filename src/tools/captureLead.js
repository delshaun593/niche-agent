import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;
const supabase = createClient(supabaseUrl, supabaseKey);
export async function captureLead(params, userId) {
    console.log(`[Tool: captureLead] Executing with params:`, params);
    if (!config.supabase.url) {
        console.warn("Supabase URL not configured, skipping DB insert.");
        return { status: "success", message: "Mock lead captured." };
    }
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
//# sourceMappingURL=captureLead.js.map