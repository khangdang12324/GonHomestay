import type { Price } from "@/types";
import { siteConfig } from "./constants";

export const prices: Price[] = [
  { guestCount: 1, price: siteConfig.dailyPricePerGuest },
  { guestCount: 2, price: siteConfig.dailyPricePerGuest * 2 },
  { guestCount: 3, price: siteConfig.dailyPricePerGuest * 3 },
  { guestCount: 4, price: siteConfig.dailyPricePerGuest * 4 },
  { guestCount: 5, price: siteConfig.dailyPricePerGuest * 5 },
];

export function getPriceForGuests(guests: number) {
  return prices.find((item) => item.guestCount === guests)?.price ?? 0;
}
