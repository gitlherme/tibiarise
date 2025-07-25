import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_ROUTES = ["/dashboard", "/settings"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  // Check if the user is authenticated
  if (
    !session &&
    PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.includes(route))
  ) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Step 1: Use the incoming request (example)
  const defaultLocale = request.headers.get("x-your-custom-locale") || "en";

  // Step 2: Create and call the next-intl middleware (example)
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  // Step 3: Alter the response (example)
  response.headers.set("x-your-custom-locale", defaultLocale);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(pt|en)/:path*"],
};
