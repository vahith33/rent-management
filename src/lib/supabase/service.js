import { createClient } from '@supabase/supabase-js'

// Singleton service role client for admin operations (bypasses RLS).
// This IS safe to be a singleton because it doesn't depend on per-request
// cookies — it uses the fixed service_role key for all requests.
let serviceClient = null

export function createServiceRoleClient() {
  if (serviceClient) return serviceClient

  serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  return serviceClient
}
