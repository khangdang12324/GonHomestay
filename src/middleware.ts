import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next();
  }

  const cookiesToSet: Parameters<
    NonNullable<Parameters<typeof createServerClient>[2]["cookies"]["setAll"]>
  >[0] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(nextCookies) {
        cookiesToSet.push(...nextCookies);
      },
    },
  });

  // Refresh session to keep it alive
  await supabase.auth.getSession();

  const response = NextResponse.next();

  // Set cookies back on response
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with the following
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
