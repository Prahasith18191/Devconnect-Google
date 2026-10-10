import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://chzctkckibbgoqsrmqaj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoemN0a2NraWJiZ29xc3JtcWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MTE3NDMsImV4cCI6MjEwNzE4Nzc0M30.y6HhRWe6vrzAvyZDZ9J5ylSn7dQUEr0pZn2YwnRlFQw';
export const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoemN0a2NraWJiZ29xc3JtcWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTYxMTc0MywiZXhwIjoyMTA3MTg3NzQzfQ.GhdtYBm8AC7ePVrF68vMcSZtZrcGYilynTDpZcjH7_8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
