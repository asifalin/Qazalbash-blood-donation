import { createClient } from '@supabase/supabase-js'

// 🔐 Directly adding your actual URL and anon key
const supabaseUrl = 'https://bfkpuxsppgdsvbuwknog.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJma3B1eHNwcGdkc3ZidXdrbm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTk4NDEsImV4cCI6MjA3MDEzNTg0MX0.TI6RTlh56UHW-j5WGMuALvJe7P86SqW3VXMFkhBc4Uc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
