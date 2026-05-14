import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT use getSession() here — it reads from the cookie
  // without verifying with the Supabase Auth server, which is a security risk.
  // getUser() contacts the server and is the only safe way to validate.
  //
  // Performance note: This call happens on EVERY request but it does NOT
  // block page rendering — middleware runs at the edge before the page loads.
  // The ~50ms overhead is worth it to keep the auth session fresh.
  let user = null;
  let authError = null;
  try {
    const { data, error } = await supabase.auth.getUser()
    user = data.user
    authError = error
  } catch (err) {
    console.error("Middleware Auth Fetch Error:", err.message)
    authError = err
  }

  // Only redirect if we definitely don't have a user AND it wasn't a network error
  // If it's a 'fetch failed' error, we skip redirection to prevent aggressive logouts during network instability
  const isNetworkError = authError?.message?.includes('fetch failed') || authError?.message?.includes('network');

  if (
    !user &&
    !isNetworkError &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/otp-verify') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
