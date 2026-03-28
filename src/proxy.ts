import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Security Headers implementation
const securityHeaders = {
    "Content-Security-Policy": 
        `default-src 'self'; ` +
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; ` +
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
        `img-src 'self' data: blob: https://*; ` +
        `font-src 'self' https://fonts.gstatic.com; ` +
        `frame-src 'self' https://api.razorpay.com https://*.razorpay.com; ` +
        `connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com; ` +
        `upgrade-insecure-requests;`,
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Apply Security Headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // 2. Auth & Role Protection
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Admin Route Protection
    if (pathname.startsWith("/admin")) {
        // Allow admin login without session
        if (pathname === "/admin/login") return response;

        if (!token) {
            const url = new URL("/login", request.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }
        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Student Route Protection
    if (pathname.startsWith("/student")) {
         // Allow student login without session
        if (pathname === "/student/login") return response;

        if (!token) {
            const url = new URL("/login", request.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }
    }

    // Redirect logged in users away from public login/register
    if ((pathname === "/login" || pathname === "/student/login") && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
}

export default middleware;

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
