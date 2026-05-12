import { createClient } from '@/utils/supabase/server'

// Example: Server Component that fetches data from Supabase.
// This runs on the server — no client-side JavaScript is shipped for this component.
export default async function ExampleServerComponent() {
  const supabase = await createClient()

  // getUser() is already called in the middleware, so the session cookies
  // are fresh. We can safely use getSession() here for reading user info
  // without an extra network call.
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <p>Not logged in</p>
  }

  // Example: fetch rooms for the current user
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, room_number, capacity')
    .limit(5)

  if (error) {
    return <p>Error loading rooms: {error.message}</p>
  }

  return (
    <div>
      <h2>Welcome, {session.user.email}</h2>
      <p>You have {rooms?.length || 0} rooms</p>
      <ul>
        {rooms?.map(room => (
          <li key={room.id}>Room {room.room_number} (capacity: {room.capacity})</li>
        ))}
      </ul>
    </div>
  )
}
