import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Recommended for Next.js
    debug: process.env.NODE_ENV === 'development' // Enable auth debugging in dev
  }
});

// Helper function to normalize email
export const normalizeEmail = (email: string) => email.trim().toLowerCase();