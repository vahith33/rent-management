// Re-export from the canonical location to avoid having two identical files.
// All server-side Supabase auth usage should import from '@/utils/supabase/server'.
// This file exists only for backwards compatibility with imports using '@/lib/supabase/server'.
export { createClient } from '@/utils/supabase/server'
