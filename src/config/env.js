import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: process.env.PORT || 3000,
    supabase: {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    },
    vapi: {
        secret: process.env.VAPI_SECRET || '', // To verify webhooks from Vapi
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    }
};
//# sourceMappingURL=env.js.map