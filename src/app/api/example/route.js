import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Pin this API route to Tokyo (hnd1) to match the Supabase region
export const preferredRegion = 'hnd1'

// Example: Route Handler (API endpoint) using the Supabase server client.
// URL: /api/example
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, room_number, capacity, status')
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rooms })
}
