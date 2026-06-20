"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AdminLoginResult = {
  ok: boolean;
  message: string;
};

export async function loginAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AdminLoginResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Chưa cấu hình Supabase. Admin chỉ hoạt động với dữ liệu thật.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "Tài khoản này không có quyền admin.",
    };
  }

  return {
    ok: true,
    message: "Đăng nhập thành công.",
  };
}

export async function loginAdminAndRedirect({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await loginAdmin({ email, password });

  if (!result.ok) {
    return result;
  }

  redirect("/admin");
}
