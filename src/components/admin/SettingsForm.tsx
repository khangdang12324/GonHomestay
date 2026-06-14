"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Setting } from "@/types";

export function SettingsForm({ settings }: { settings: Setting[] }) {
  const [items, setItems] = useState(settings);
  const [isPending, startTransition] = useTransition();

  function updateValue(key: string, value: string) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, value } : item)),
    );
  }

  function saveSettings() {
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        toast.error("Chưa cấu hình Supabase nên không thể cập nhật cài đặt thật.");
        return;
      }

      const { error } = await supabase.from("settings").upsert(items, {
        onConflict: "key",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Đã cập nhật cài đặt.");
    });
  }

  return (
    <div className="rounded-lg border border-[#e5d8c5] bg-white p-5">
      <div className="grid gap-4">
        {items.map((setting) => (
          <label key={setting.key} className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            {setting.key}
            {setting.value.length > 80 ? (
              <Textarea
                value={setting.value}
                onChange={(event) => updateValue(setting.key, event.target.value)}
              />
            ) : (
              <Input
                value={setting.value}
                onChange={(event) => updateValue(setting.key, event.target.value)}
              />
            )}
          </label>
        ))}
      </div>
      <Button type="button" className="mt-5" onClick={saveSettings} disabled={isPending}>
        {isPending ? "Đang cập nhật..." : "Cập nhật cài đặt"}
      </Button>
    </div>
  );
}
