"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyVND } from "@/lib/utils";

export function RevenueChart({
  data,
}: {
  data: Array<{ date: string; revenue: number }>;
}) {
  return (
    <div className="h-[300px] rounded-lg border border-[#e5d8c5] bg-white p-4">
      <h2 className="mb-4 font-bold text-[#2f241b]">Doanh thu 7 ngày</h2>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2f5d46" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2f5d46" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#efe3d2" strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrencyVND(Number(value))} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2f5d46"
            strokeWidth={2}
            fill="url(#revenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
