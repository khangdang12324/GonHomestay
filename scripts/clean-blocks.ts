import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: blocks } = await supabase.from("bookings").select("*").eq("status", "BLOCKED").order("created_at", { ascending: true });
  
  if (!blocks) return;

  const keepIds = new Set();
  const deleteIds = new Set();

  for (const block of blocks) {
    const key = `${block.check_in}_${block.check_out}`;
    if (keepIds.has(key)) {
      deleteIds.add(block.id);
    } else {
      keepIds.add(key);
    }
  }

  if (deleteIds.size > 0) {
    const ids = Array.from(deleteIds);
    await supabase.from("bookings").delete().in("id", ids);
    console.log(`Deleted ${ids.length} duplicate blocks`);
  } else {
    console.log("No duplicates found");
  }
}
main();
