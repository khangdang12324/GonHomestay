import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function StatsCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6d5a49]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#2f241b]">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#e6f0e9] text-[#2f5d46]">
          {icon}
        </div>
      </div>
    </Card>
  );
}
