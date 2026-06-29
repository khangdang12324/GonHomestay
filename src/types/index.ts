export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "BLOCKED";

export type RoomStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "HIDDEN";

export type GalleryCategory =
  | "bedroom"
  | "kitchen"
  | "bbq"
  | "outside"
  | "parking"
  | "living";

export type Room = {
  id: string;
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  basePrice: number;
  status: RoomStatus;
  coverImageUrl: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  featured?: boolean;
};

export type Price = {
  guestCount: number;
  price: number;
};

export type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  note?: string;
  source?: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  bookingCount: number;
  totalSpent: number;
  note?: string;
};

export type Setting = {
  key: string;
  value: string;
};
