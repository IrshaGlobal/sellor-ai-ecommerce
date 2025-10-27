import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle store-specific routes
  if (pathname.startsWith('/store/') || pathname.startsWith('/api/store/')) {
    const pathSegments = pathname.split('/')
    const storeSlug = pathSegments[2] // /store/[slug]/...

    // Skip if slug is missing
    if (!storeSlug) {
      return NextResponse.next()
    }

    // Add store context to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-store-slug', storeSlug)

    // For protected API routes, check for token presence
    // Allow public access to store info and products
    const isPublicRoute = pathname.includes('/products') || 
                         pathname === `/api/store/${storeSlug}`
    
    if (pathname.startsWith('/api/store/') && !isPublicRoute) {
      const token = request.cookies.get('store_token')?.value

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Note: JWT verification is now done in API routes (not in middleware)
      // because middleware runs on Edge runtime which doesn't support all Node.js APIs
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Handle custom domains (simplified for now)
  const host = request.headers.get('host')
  if (host && host !== 'localhost:3000' && !host.includes('.vercel.app')) {
    // This is a custom domain, add to headers for future processing
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-custom-domain', host)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/store/:path*',
    '/api/store/:path*',
    '/api/auth/store-login',
    '/api/auth/store-register',
    '/api/auth/verify-store-token'
  ]
}