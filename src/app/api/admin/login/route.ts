import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LoginBody = {
  email?: string;
  password?: string;
};

function jsonResponse(ok: boolean, message: string, status = 200) {
  return NextResponse.json({ ok, message }, { status });
}

export async function POST(request: NextRequest) {
  const client = createSupabaseRouteHandlerClient(request);

  if (!client) {
    return jsonResponse(
      false,
      "Chưa cấu hình Supabase. Admin chỉ hoạt động với dữ liệu thật.",
      500,
    );
  }

  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(false, "Dữ liệu đăng nhập không hợp lệ.", 400);
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return jsonResponse(false, "Vui lòng nhập email và mật khẩu.", 400);
  }

  const { supabase } = client;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return client.applyTo(jsonResponse(false, error.message, 401));
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    await supabase.auth.signOut();
    return client.applyTo(jsonResponse(false, "Không xác thực được phiên đăng nhập.", 401));
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return client.applyTo(jsonResponse(false, "Tài khoản này không có quyền admin.", 403));
  }

  return client.applyTo(jsonResponse(true, "Đăng nhập thành công."));
}
