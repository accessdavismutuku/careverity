import { NextResponse, type NextRequest } from "next/server";
import { getCareVerityRuntimeMode } from "./lib/careverity-runtime-mode";
import { isProtectedPath } from "./lib/rbac";
import { refreshSupabaseSession } from "./utils/supabase/middleware";

const sessionCookieNames = ["sb-access-token", "sb-refresh-token", "lqcs-demo-session"];

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("x-careverity-security-baseline", "headers-enabled");
  response.headers.set("x-careverity-tenant-rule", "companyId-required-for-production-records");

  if (process.env.NODE_ENV === "production" || process.env.HTTPS_REQUIRED === "true") {
    response.headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshedResponse = await refreshSupabaseSession(request);

  if (!isProtectedPath(pathname)) {
    return withSecurityHeaders(refreshedResponse);
  }

  const runtimeMode = getCareVerityRuntimeMode();
  const demoMode = runtimeMode.demoMode;

  if (demoMode) {
    const response = refreshedResponse;
    response.headers.set("x-lqcs-demo-mode", "true");
    response.headers.set("cache-control", "no-store");
    return withSecurityHeaders(response);
  }

  if (runtimeMode.productionBackendEnabled && !runtimeMode.backendConfigured && pathname.startsWith("/careverity-ecm")) {
    const response = refreshedResponse;
    response.headers.set("x-careverity-backend-status", "backend_not_configured");
    response.headers.set("cache-control", "no-store");
    return withSecurityHeaders(response);
  }

  const hasKnownSessionCookie =
    sessionCookieNames.some((name) => request.cookies.has(name)) ||
    request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

  if (hasKnownSessionCookie) {
    const response = refreshedResponse;
    response.headers.set("cache-control", "no-store");
    return withSecurityHeaders(response);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return withSecurityHeaders(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|videos).*)"]
};
