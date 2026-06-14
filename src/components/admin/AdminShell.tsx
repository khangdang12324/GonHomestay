import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-[#f8f1e7] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 rounded-lg border border-[#e5d8c5] bg-white p-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#2f241b]">{title}</h1>
            <p className="mt-1 text-sm text-[#6d5a49]">{description}</p>
          </div>
          <span className="rounded-full bg-[#e6f0e9] px-3 py-1 text-xs font-semibold text-[#2f5d46]">
            Supabase required
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <AdminSidebar />
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
