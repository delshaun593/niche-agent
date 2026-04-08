import { Router, Request, Response } from 'express';
import { captureLead } from '../tools/captureLead.js';
import { bookAppointment } from '../tools/bookAppointment.js';
import { config } from '../config/env.js';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;
const supabase = createClient(supabaseUrl, supabaseKey);
const router = Router();
router.post('/vapi-webhook', async (req, res) => {
    try {
        const payload = req.body;
        // Optional Vapi signature verification (not fully implemented here, placeholder)
        const vapiSecret = req.headers['x-vapi-secret'];
        if (config.vapi.secret && vapiSecret !== config.vapi.secret) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const message = payload.message;
        // We can extract the assistant ID from the Vapi call details
        const assistantId = message?.call?.assistantId || null;
        let userId = undefined;
        if (assistantId && config.supabase.url) {
            // Lookup which user owns this assistant
            const { data: agentData } = await supabase
                .from('agents')
                .select('user_id')
                .eq('vapi_assistant_id', assistantId)
                .single();
            if (agentData) {
                userId = agentData.user_id;
            }
        }
        // Vapi sends different types of messages.
        // For tool calling (functions), it sends type: 'tool-calls'
        if (message?.type === 'tool-calls') {
            const results = [];
            for (const toolCall of message.toolWithToolCallList) {
                const functionName = toolCall.tool.function.name;
                const args = toolCall.toolCall.function.arguments; // Already parsed by Vapi
                try {
                    let result;
                    if (functionName === 'captureLead') {
                        result = await captureLead(args, userId);
                    }
                    else if (functionName === 'bookAppointment') {
                        result = await bookAppointment(args, userId);
                    }
                    else {
                        result = { error: `Unknown function: ${functionName}` };
                    }
                    results.push({
                        toolCallId: toolCall.toolCall.id,
                        result: result
                    });
                }
                catch (error) {
                    results.push({
                        toolCallId: toolCall.toolCall.id,
                        result: { error: error.message }
                    });
                }
            }
            // Respond to Vapi with the results of the tool calls
            res.status(201).json({
                results: results
            });
            return;
        }
        // Acknowledge other webhook types (e.g. status-update, end-of-call-report)
        res.status(200).send('Webhook received');
    }
    catch (error) {
        console.error('Error processing Vapi webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
//# sourceMappingURL=vapi.js.map