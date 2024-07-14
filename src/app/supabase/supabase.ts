import { createClient } from '@supabase/supabase-js'

// TODO: anon keyで動くようにしたい。
const supabaseUrl = 'https://bfhwdodoayetjtbuqydp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaHdkb2RvYXlldGp0YnVxeWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODE2MDA3MSwiZXhwIjoyMDMzNzM2MDcxfQ._HNZpE0QC57IOCfhcuUPtxJZ6Z9sKBPdOFy9YojuFQI"
export const supabase = createClient(supabaseUrl, supabaseKey)
