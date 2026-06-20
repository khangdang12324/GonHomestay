import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LoginBody = {
  email?: string;
  password?: string;
};

function createJsonResponse(ok: boolean, message: string, status = 200) {
  const response = NextResponse.json({ ok, message }, { status });
  // Ensure proper response headers
  response.headers.set("Content-Type", "application/json");
  return response;
}

export async function POST(request: NextRequest) {
  const client = createSupabaseRouteHandlerClient(request);

  if (!client) {
    return createJsonResponse(
      false,
      "Chưa cấu hình Supabase. Admin chỉ hoạt động với dữ liệu thật.",
      500,
    );
  }

  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return createJsonResponse(false, "Dữ liệu đăng nhập không hợp lệ.", 400);
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return createJsonResponse(false, "Vui lòng nhập email và mật khẩu.", 400);
  }

  const { supabase } = client;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const response = createJsonResponse(false, error.message, 401);
    return client.applyTo(response);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    await supabase.auth.signOut();
    const response = createJsonResponse(false, "Không xác thực được phiên đăng nhập.", 401);
    return client.applyTo(response);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    const response = createJsonResponse(false, "Tài khoản này không có quyền admin.", 403);
    return client.applyTo(response);
  }

  const response = createJsonResponse(true, "Đăng nhập thành công.");
  return client.applyTo(response);
}
