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
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/google/callback',
  }
};

// Validation logging for Render debugging
console.log('[Config] Environment variables loaded:');
console.log('- Port:', config.port);
console.log('- Supabase URL:', config.supabase.url ? 'SET' : 'MISSING');
console.log('- Supabase Key:', config.supabase.serviceRoleKey || config.supabase.anonKey ? 'SET' : 'MISSING');
console.log('- Google Client ID:', config.google.clientId ? 'SET' : 'MISSING');
console.log('- Resend API Key:', config.resend.apiKey ? 'SET' : 'MISSING');
console.log('- VAPI Secret:', config.vapi.secret ? 'SET' : 'MISSING');
