"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        toast.error("Chưa cấu hình Supabase. Admin chỉ hoạt động với dữ liệu thật.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }

      const profile = await supabase
        .from("profiles")
        .select("role")
        .single();

      if (profile.error || profile.data?.role !== "admin") {
        await supabase.auth.signOut();
        toast.error("Tài khoản này không có quyền admin.");
        return;
      }

      toast.success("Đăng nhập thành công.");
      window.location.href = "/admin";
    });
  }

  return (
    <section className="bg-[#fffaf2] py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#e5d8c5] bg-white p-6">
          <h1 className="text-2xl font-bold text-[#2f241b]">Đăng nhập admin</h1>
          <p className="mt-2 text-sm text-[#6d5a49]">
            Admin chỉ dành cho tài khoản của chủ homestay trong Supabase Auth. Không lưu mật khẩu trong source code.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
              Email
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
              Mật khẩu
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
            </label>
            <Button disabled={isPending} type="submit">
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
