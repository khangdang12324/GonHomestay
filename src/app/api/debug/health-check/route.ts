import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminClient = createSupabaseAdminClient();
    const serverClient = await createSupabaseServerClient();

    const config = {
      adminClientExists: !!adminClient,
      serverClientExists: !!serverClient,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    };

    // Try to fetch bookings
    let bookingsTest = null;
    let bookingsError = null;

    if (adminClient || serverClient) {
      const supabase = adminClient || serverClient;
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .limit(1);

      if (error) {
        bookingsError = {
          code: error.code,
          message: error.message,
        };
      } else {
        bookingsTest = {
          success: true,
          count: data?.length || 0,
        };
      }
    }

    return NextResponse.json({
      config,
      bookingsTest,
      bookingsError,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
