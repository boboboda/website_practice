import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from 'path-to-regexp'
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest) {

    const session = await getToken({ req: request, secret: process.env.AUTH_SECRET })

    if (session && (request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/signin')) {
        // 메인 페이지나 다른 페이지로 리다이렉트
        console.log('미들웨어 실행', session)
        return NextResponse.redirect(new URL('/', request.url))
      }

      return NextResponse.next()
}

export const config = {
    matcher: ['/signup', '/signin']
  }