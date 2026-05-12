import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side client using @supabase/ssr.
// NOTE: This CANNOT be a singleton — each request needs its own cookie context.
// The cookies() call is unique per request in the App Router, so a fresh client
// is required each time. This is the correct Supabase pattern for server usage.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
