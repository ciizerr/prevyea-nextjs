import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Resolve the JWT token directly
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const isLoggedIn = !!token;

    // Route classifications
    const isApiAuthRoute = pathname.startsWith("/api/auth");
    const isPublicRoute = pathname === "/" || pathname === "/vault" || pathname === "/syllabus" || pathname === "/notice" || pathname.startsWith("/u/");
    const isAuthRoute = pathname === "/login" || pathname === "/signup";

    // 1. Always allow API auth routes
    if (isApiAuthRoute) return NextResponse.next();

    // 2. Always allow public routes
    if (isPublicRoute) return NextResponse.next();

    // 3. Auth routes — redirect logged-in users to dashboard
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // 4. All remaining routes are private — must be logged in
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
