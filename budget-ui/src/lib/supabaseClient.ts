import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwxrtoibwcokxfqxmzbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eHJ0b2lid2Nva3hmcXhtemJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjkyNTIsImV4cCI6MjA4ODA0NTI1Mn0.873xlFyyJSh32eUrSysFUlaW5S9zEHMHDJRvf64bd24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
