import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseEnv = supabaseUrl && supabaseAnonKey;

  // If no Supabase config, redirect to login
  if (!hasSupabaseEnv && url.pathname !== "/admin/login") {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Create a response to potentially modify
  let response = NextResponse.next({
    request,
  });

  if (hasSupabaseEnv) {
    const cookiesToSet: Parameters<
      NonNullable<Parameters<typeof createServerClient>[2]["cookies"]["setAll"]>
    >[0] = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nextCookies) {
          cookiesToSet.push(...nextCookies);
        },
      },
    });

    // Refresh session to keep tokens valid
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Set cookies on response
    response = NextResponse.next({
      request,
    });
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    // Redirect logic
    if (!user && url.pathname !== "/admin/login") {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (user && url.pathname === "/admin/login") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
