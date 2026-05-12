import { createBrowserClient } from '@supabase/ssr'

// Singleton pattern — only one instance is ever created across the entire app.
// Without this, every component that calls createClient() would spawn a new
// GoTrue connection and a new realtime WebSocket, wasting memory and bandwidth.
let browserClient = null

export function createClient() {
  if (browserClient) return browserClient

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return browserClient
}
