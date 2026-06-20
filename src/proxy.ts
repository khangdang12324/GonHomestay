import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseEnv = supabaseUrl && supabaseAnonKey;

  if (!hasSupabaseEnv && url.pathname !== "/admin/login") {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({
    request,
  });

  if (hasSupabaseEnv) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headersToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headersToSet).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && url.pathname !== "/admin/login") {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (user && url.pathname === "/admin/login") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname === "/admin/login") {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
