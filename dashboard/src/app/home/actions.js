'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAgentConfig = saveAgentConfig;
const server_1 = require("@/utils/supabase/server");
const cache_1 = require("next/cache");
async function saveAgentConfig(formData) {
    const supabase = await (0, server_1.createClient)();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Not authenticated');
    }
    const name = formData.get('name');
    const greeting = formData.get('greeting');
    const systemPrompt = formData.get('system_prompt');
    const vapiAssistantId = formData.get('assistant_id'); // User would need to input this, or we retrieve it
    // Update or Insert the agent configuration
    const { error } = await supabase
        .from('agents')
        .upsert({
        user_id: user.id,
        name,
        greeting,
        system_prompt: systemPrompt,
        updated_at: new Date().toISOString()
        // Note: mapping `vapi_assistant_id` should ideally just happen once when they link Vapi.
    }, { onConflict: 'user_id' });
    if (error) {
        console.error('Error saving config', error);
        throw new Error('Failed to save configuration');
    }
    (0, cache_1.revalidatePath)('/home');
    // TO-DO: Optional - use the Vapi REST API here to patch the real Assistant on Vapi
    // fetch(`https://api.vapi.ai/assistant/${vapiAssistantId}`, {
    //   method: 'PATCH',
    //   headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_API_KEY}` },
    //   body: JSON.stringify({ model: { messages: [{ role: 'system', content: systemPrompt }] } })
    // })
}
//# sourceMappingURL=actions.js.map