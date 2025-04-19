import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, uploadThingApi } from "@/routes";

// Wrapped middleware option
const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isUploadThingApi = nextUrl.pathname.startsWith(uploadThingApi);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // exclude auth api route & file upload api route
    if (isApiAuthRoute || isUploadThingApi) {
        return;
    }

    // if the route is related to auth pages, and if user is NOT logged in, redirect to default login redirect
    if (isAuthRoute) {
        if (!isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }

    // if user is not logged in, and the route is not public (protected), redirect to login page
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/auth/login', nextUrl))
    }

    return;
})

/**
 * Matcher explanation:
 * 
 * "/((?!.+\\.[\\w]+$|_next).*)":
 * Matches all routes except file extensions and _next routes
 * 
 * "/":
 * Matches the root route
 * 
 * "/(api|trpc)(.*)":
 * Matches any route starting with /api or /trpc
 * 
 * Together these patterns ensure middleware runs on all relevant paths
 * while excluding static files and Next.js internal routes
 */

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}