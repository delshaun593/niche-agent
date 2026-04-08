import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';
import { sendConfirmation } from './sendConfirmation.js';
import { google } from 'googleapis';
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;
const supabase = createClient(supabaseUrl, supabaseKey);
// Shared OAuth2 Client logic
const getOAuth2Client = (refreshToken) => {
    const oauth2Client = new google.auth.OAuth2(config.google.clientId, config.google.clientSecret, config.google.redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    return oauth2Client;
};
export async function bookAppointment(params, userId) {
    console.log(`[Tool: bookAppointment] Executing with params:`, params);
    // 1. Save appointment to database
    if (config.supabase.url) {
        const { error } = await supabase
            .from('appointments')
            .insert([{
                user_id: userId,
                name: params.name,
                email: params.email,
                phone: params.phone,
                service: params.service,
                appointment_time: params.appointmentTime,
                created_at: new Date().toISOString()
            }]);
        if (error) {
            console.error("Error saving appointment:", error);
            throw new Error(`Failed to save appointment: ${error.message}`);
        }
    }
    else {
        console.warn("Supabase URL not configured, skipping DB insert for appointment.");
    }
    // 2. Trigger the confirmation email
    try {
        await sendConfirmation({
            name: params.name,
            email: params.email,
            appointmentTime: params.appointmentTime,
            service: params.service
        });
    }
    catch (err) {
        console.error("Failed to send confirmation email, but appointment was booked.", err);
    }
    // 3. Push to Google Calendar (Option B: Tenant-specific OAuth)
    if (userId) {
        try {
            // Look up the refresh token from Supabase
            const { data: agentData } = await supabase
                .from('agents')
                .select('google_refresh_token')
                .eq('user_id', userId)
                .single();
            if (agentData?.google_refresh_token) {
                const oauth2Client = getOAuth2Client(agentData.google_refresh_token);
                const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
                const startTime = new Date(params.appointmentTime);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
                await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: {
                        summary: `Appointment: ${params.service || 'Service Consultation'}`,
                        description: `Appointment with ${params.name}\nPhone: ${params.phone || 'N/A'}\nEmail: ${params.email}`,
                        start: { dateTime: startTime.toISOString() },
                        end: { dateTime: endTime.toISOString() },
                        attendees: [{ email: params.email }]
                    }
                });
                console.log(`[Tool: bookAppointment] Added event to User's Google Calendar!`);
            }
            else {
                console.log(`[Tool: bookAppointment] User ${userId} has not linked a Google Calendar.`);
            }
        }
        catch (err) {
            console.error("Failed to push to Google Calendar:", err.message);
        }
    }
    else {
        console.warn("No userId passed to bookAppointment. Cannot sync to a tenant's calendar.");
    }
    return { status: "success", message: `Appointment successfully booked for ${params.appointmentTime}` };
}
//# sourceMappingURL=bookAppointment.js.map