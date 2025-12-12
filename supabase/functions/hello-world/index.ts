// Supabase Edge Function: Hello World
// A simple function that returns a greeting message

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { name } = await req.json().catch(() => ({}));
    
    const greeting = name 
      ? `Hello, ${name}! Welcome to Supabase Edge Functions.`
      : 'Hello, World! Welcome to Supabase Edge Functions.';
    
    const data = {
      message: greeting,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    };

    return new Response(
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

