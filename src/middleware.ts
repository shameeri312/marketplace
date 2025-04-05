/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session: any = await auth();

  // If no token, redirect to homepage
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/chat', '/chat/:id', '/post'],
};
