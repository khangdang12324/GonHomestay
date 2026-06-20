import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

export function createSupabaseRouteHandlerClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookiesToSet: Parameters<
    NonNullable<Parameters<typeof createServerClient>[2]["cookies"]["setAll"]>
  >[0] = [];
  const headersToSet: Record<string, string> = {};

  if (!url || !anonKey) {
    return null;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(nextCookies, nextHeaders) {
        cookiesToSet.push(...nextCookies);
        Object.assign(headersToSet, nextHeaders);
      },
    },
  });

  return {
    supabase,
    applyTo(response: NextResponse) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      Object.entries(headersToSet).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    },
  };
}
