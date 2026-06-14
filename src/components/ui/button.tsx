import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[#2f5d46] text-white hover:bg-[#274d3a]",
  secondary: "bg-[#8a5a36] text-white hover:bg-[#72492d]",
  outline:
    "border border-[#d7c7ad] bg-white/80 text-[#3a2a1d] hover:bg-[#f8f1e7]",
  ghost: "text-[#3a2a1d] hover:bg-[#f8f1e7]",
  danger: "bg-[#b42318] text-white hover:bg-[#912018]",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition",
        variants[variant ?? "primary"],
        className,
      )}
    >
      {children}
    </Link>
  );
}
