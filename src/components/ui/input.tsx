import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-[#d7c7ad] bg-white px-3 text-sm outline-none transition placeholder:text-[#9c8d78] focus:border-[#2f5d46] focus:ring-2 focus:ring-[#2f5d46]/15",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-lg border border-[#d7c7ad] bg-white px-3 py-2 text-sm outline-none transition placeholder:text-[#9c8d78] focus:border-[#2f5d46] focus:ring-2 focus:ring-[#2f5d46]/15",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-lg border border-[#d7c7ad] bg-white px-3 text-sm outline-none transition focus:border-[#2f5d46] focus:ring-2 focus:ring-[#2f5d46]/15",
        className,
      )}
      {...props}
    />
  );
}
