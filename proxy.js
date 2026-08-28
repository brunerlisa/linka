import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = ['/dashboard', '/admin']

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export async function proxy(request) {
  try {
    return await updateSession(request)
  } catch (error) {
    console.error('Auth proxy error:', error)
    if (isProtectedPath(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/sign-in'
      url.search = ''
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }
}

async function updateSession(request) {
  let response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/manifest.webmanifest' ||
    pathname.startsWith('/google')
  ) {
    return NextResponse.next({ request })
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (isProtectedPath(pathname)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/sign-in'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtectedPath(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|html|txt)$).*)',
  ],
}
