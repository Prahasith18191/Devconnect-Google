import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://chzctkckibbgoqsrmqaj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoemN0a2NraWJiZ29xc3JtcWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MTE3NDMsImV4cCI6MjEwNzE4Nzc0M30.y6HhRWe6vrzAvyZDZ9J5ylSn7dQUEr0pZn2YwnRlFQw';
// NOTE: the service_role key must NEVER live in frontend code (it bypasses RLS).
// It was removed from the client bundle — server-only work uses it via env, never here.

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
