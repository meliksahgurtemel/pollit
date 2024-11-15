import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_KEY')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

// Create a single instance of the Supabase client for the server
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)