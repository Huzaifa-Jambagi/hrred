// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/post-job(.*)',
  '/jobs(.*)',
  '/my-jobs(.*)',
  '/saved-jobs(.*)',
  '/onboarding(.*)'
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // If route is protected, ensure user is authenticated
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // ONLY redirect away from onboarding if user already has a role
  if (userId && isOnboardingRoute(req)) {
const role = (sessionClaims?.unsafeMetadata as any)?.role;    
    if (role) {
      const redirectUrl = new URL(
        role === 'recruiter' ? '/post-job' : '/jobs',
        req.url
      );
      return NextResponse.redirect(redirectUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};