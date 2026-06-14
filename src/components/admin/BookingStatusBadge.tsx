import { Badge } from "@/components/ui/badge";
import { bookingStatusLabels } from "@/data/constants";
import type { BookingStatus } from "@/types";

const statusClasses: Record<BookingStatus, string> = {
  PENDING: "bg-[#fef3c7] text-[#92400e]",
  CONFIRMED: "bg-[#dbeafe] text-[#1d4ed8]",
  CHECKED_IN: "bg-[#dcfce7] text-[#166534]",
  CHECKED_OUT: "bg-[#f3f4f6] text-[#374151]",
  CANCELLED: "bg-[#fee2e2] text-[#b42318]",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge className={statusClasses[status]}>{bookingStatusLabels[status]}</Badge>;
}
