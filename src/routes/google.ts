import { Router } from 'express';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

const router = Router();

// OAuth2 Client initialization helper
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
};

// 1. Generate auth url and redirect user
router.get('/auth', (req, res) => {
  const userId = req.query.userId as string;
  
  if (!userId) {
    return res.status(400).send("Missing userId. Cannot link calendar without knowing which account to link.");
  }

  const oauth2Client = getOAuth2Client();

  // Generate a url that asks permissions for Google Calendar scopes
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request offline access to receive a refresh token
    prompt: 'consent', // Force consent prompt to guarantee a refresh token is provided
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state: userId // Pass the userId as state so we know who they are when they return
  });

  res.redirect(url);
});

// 2. Handle the callback from Google
router.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const userId = req.query.state as string; // We passed userId in the state parameter
  
  if (!code || !userId) {
    return res.status(400).send("Missing code or state parameter.");
  }

  // Lazy initialize Supabase to prevent startup crashes if config is missing
  const supabase = (config.supabase.url && config.supabase.anonKey) 
    ? createClient(config.supabase.url, config.supabase.serviceRoleKey || config.supabase.anonKey)
    : null;

  const oauth2Client = getOAuth2Client();

  try {
    // Exchange the authorization code for an access token and refresh token
    const { tokens } = await oauth2Client.getToken(code);
    
    // We strictly need the refresh token to book appointments when the user is offline
    if (tokens.refresh_token && supabase) {
      // Save to Supabase
      const { error } = await supabase
        .from('agents')
        .update({ google_refresh_token: tokens.refresh_token })
        .eq('user_id', userId);
        
      if (error) {
        console.error("Supabase Error saving refresh token:", error);
        return res.status(500).send("Failed to save calendar integration details.");
      }
      
      return res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h2>Google Calendar Linked Successfully!</h2>
            <p>Your AI Agent can now book appointments directly to your calendar.</p>
            <script>setTimeout(() => window.close(), 3000);</script>
          </body>
        </html>
      `);
    } else if (!supabase) {
      return res.status(500).send("Supabase configuration missing on server.");
    } else {
      // If we didn't receive a refresh token (maybe they authorized previously)
      return res.send("Authorization received, but no refresh token was provided. You may need to revoke access in your Google Account and try again.");
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send("Failed to authenticate with Google.");
  }
});

export default router;
