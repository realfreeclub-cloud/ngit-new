import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const proxyHandler = withAuth(
    function proxy(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Check if the user is an admin for admin routes (excluding login)
        if (path.startsWith("/admin") && path !== "/admin/login" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Check if the user is logged in for student routes (excluding login)
        if (path.startsWith("/student") && path !== "/student/login" && !token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                if (path === "/admin/login" || path === "/student/login") {
                    return true;
                }
                return !!token;
            },
        },
    }
);

export default proxyHandler;
export { proxyHandler as proxy };

export const config = {
    matcher: ["/admin/:path*", "/student/:path*"],
};
