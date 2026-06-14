"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatCurrencyVND } from "@/lib/utils";
import type { Price } from "@/types";

export function PriceTable({ initialPrices }: { initialPrices: Price[] }) {
  const [prices, setPrices] = useState(initialPrices);

  async function savePrices() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      toast.error("Chưa cấu hình Supabase nên không thể cập nhật giá thật.");
      return;
    }

    const { data: rooms, error: roomError } = await supabase
      .from("rooms")
      .select("id")
      .limit(1);

    if (roomError || !rooms?.[0]) {
      toast.error(roomError?.message || "Chưa có phòng trong Supabase.");
      return;
    }

    const { error } = await supabase.from("prices").upsert(
      prices.map((item) => ({
        room_id: rooms[0].id,
        guest_count: item.guestCount,
        price: item.price,
      })),
      { onConflict: "room_id,guest_count" },
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Đã cập nhật bảng giá.");
  }

  return (
    <div className="rounded-lg border border-[#e5d8c5] bg-white">
      {prices.map((item, index) => (
        <div key={item.guestCount} className="grid gap-3 border-b border-[#efe3d2] p-4 last:border-0 sm:grid-cols-[1fr_220px_160px] sm:items-center">
          <p className="font-semibold text-[#2f241b]">{item.guestCount} khách</p>
          <Input
            type="number"
            value={item.price}
            onChange={(event) => {
              const next = [...prices];
              next[index] = { ...item, price: Number(event.target.value) };
              setPrices(next);
            }}
          />
          <p className="text-sm font-bold text-[#2f5d46]">{formatCurrencyVND(item.price)}</p>
        </div>
      ))}
      <div className="p-4">
        <Button type="button" onClick={savePrices}>
          Cập nhật giá
        </Button>
      </div>
    </div>
  );
}
