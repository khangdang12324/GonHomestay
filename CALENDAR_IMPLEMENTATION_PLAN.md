# 📅 Kế Hoạch Chi Tiết: Admin Calendar Management

## 🎯 Mục Tiêu
Tạo một giao diện lịch cho admin có thể:
1. Xem lịch các phòng
2. Quản lý trạng thái phòng (mở/đóng/bảo trì)
3. Xem chi tiết booking trên lịch
4. Thay đổi ngày booking bằng drag & drop

---

## 📊 Database Changes Cần Thiết

### Thêm bảng `room_availability` (nếu cần quản lý trạng thái ngày cụ thể)

```sql
CREATE TABLE IF NOT EXISTS public.room_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('AVAILABLE', 'CLOSED', 'MAINTENANCE')) DEFAULT 'AVAILABLE',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, date)
);
```

**Hoặc:** Không cần bảng mới, dùng `bookings` table + filter

---

## 🛠️ Tech Stack

### Frontend Library
- **react-big-calendar** (React Calendar Library)
  ```bash
  npm install react-big-calendar date-fns
  ```
- Hoặc tự build calendar grid

### Data Structure
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string; // room_id
  status: 'confirmed' | 'pending' | 'blocked';
  bookingId?: string;
}
```

---

## 📁 File Structure

```
src/app/admin/
├── calendar/
│   └── page.tsx                    # Main calendar page
├── calendar/[roomId]/
│   └── page.tsx                    # Single room calendar (optional)

src/components/admin/
├── Calendar/
│   ├── CalendarGrid.tsx            # Main calendar grid
│   ├── CalendarEvent.tsx           # Event popup/modal
│   ├── CalendarToolbar.tsx         # Filter, view mode selector
│   └── DayBlocker.tsx              # Click day to mark closed
```

---

## 🚀 Implementation Steps

### Step 1: Basic Calendar Page (Week 1)
- [ ] Create page `/admin/calendar`
- [ ] Display grid layout (7 columns × weeks)
- [ ] Fetch bookings from API
- [ ] Color code events:
  - 🟩 CONFIRMED (green)
  - 🟨 PENDING (yellow)
  - 🟥 CLOSED/MAINTENANCE (red)
- [ ] Click event to see details

### Step 2: View Modes (Week 1-2)
- [ ] Month view (current)
- [ ] Week view
- [ ] Day view (detailed)
- [ ] Toolbar to switch views

### Step 3: Date Blocker (Week 2)
- [ ] Click on empty day
- [ ] Mark as "Closed" / "Maintenance"
- [ ] Save to `room_availability` table
- [ ] Display as visual block on calendar

### Step 4: Drag & Drop (Week 2-3)
- [ ] Drag event to different date
- [ ] Update booking dates
- [ ] Check availability before update
- [ ] Show confirmation dialog

### Step 5: Room Filter (Week 3)
- [ ] Dropdown to select specific room
- [ ] Show multi-room view
- [ ] Color-code by room

### Step 6: Polish & Deployment (Week 3)
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Performance optimization
- [ ] Testing

---

## 📝 Component Details

### `CalendarGrid.tsx`
```typescript
interface Props {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

// Features:
// - Render grid based on view
// - Highlight today
// - Show event count per day
// - Handle timezone
```

### `CalendarEvent.tsx` (Modal/Popup)
```typescript
// Show when clicking on event:
// - Booking customer name
// - Check-in/out dates
// - Status badge
// - Edit button → navigate to booking detail
// - Delete button
```

### `CalendarToolbar.tsx`
```typescript
// Features:
// - Month/Week/Day selector
// - Previous/Next buttons
// - Today button
// - Room filter dropdown
// - Search bookings
```

---

## 🔄 Data Flow

```
┌─────────────┐
│ /admin/calendar
└──────┬──────┘
       │ 1. Fetch bookings
       ↓
┌──────────────────────┐
│ src/server/admin-data
│ getBookings()
└──────┬───────────────┘
       │ 2. Parse dates
       ↓
┌──────────────────────┐
│ CalendarGrid renders
│ events on calendar
└──────┬───────────────┘
       │ 3. User clicks date/event
       ↓
┌──────────────────────┐
│ Show modal/popup
│ With event details
└──────┬───────────────┘
       │ 4. User edits/deletes
       ↓
┌──────────────────────┐
│ updateBooking()
│ OR markDateClosed()
└──────┬───────────────┘
       │ 5. Refresh calendar
       ↓
┌──────────────────────┐
│ Rerender with new data
└──────────────────────┘
```

---

## 🎨 UI Design

### Month View
```
┌──────────────────────────────────────┐
│  < July 2026 >  [Month][Week][Day]  │
├──────────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa                 │
├──────────────────────────────────────┤
│ 28 29 30  1  2  3  4                 │
│          [Khang 3n2d]                │
│                                      │
│  5  6  7  8  9 10 11                 │
│ [2 bookings] [Closed]               │
│                                      │
│ 12 13 14 15 16 17 18                 │
│           [Pending]                  │
│                                      │
│ 19 20 21 22 23 24 25                 │
│                      [Check-out]    │
│                                      │
│ 26 27 28 29 30 31  1                 │
└──────────────────────────────────────┘
```

### Week View
```
┌────────────────────────────────────────────────────┐
│ W28: Jul 07-13, 2026  [◀ Month ▶]                │
├────────────────────────────────────────────────────┤
│      Mon Jul 7   Tue Jul 8   Wed Jul 9 ...        │
├────────────────────────────────────────────────────┤
│      [Khang]      [Khang]    [Khang]              │
│      Pending      Pending    Confirmed            │
│                                                   │
│      [Closed]     [OK]       [OK]                 │
├────────────────────────────────────────────────────┤
│ Booking count: 3  | Status: Pending: 2, OK: 1     │
└────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

- [ ] Calendar loads correctly
- [ ] Events display on correct dates
- [ ] Colors match status
- [ ] Click event shows modal
- [ ] Edit booking from modal works
- [ ] Date blocker saves correctly
- [ ] Drag & drop updates dates
- [ ] Room filter works
- [ ] Timezone handling correct
- [ ] Mobile responsive
- [ ] Performance: load 1000+ events smoothly

---

## 📚 Reference Libraries

1. **react-big-calendar**
   - Full-featured calendar component
   - Supports drag & drop
   - Multiple view modes

2. **date-fns**
   - Date manipulation
   - Timezone handling

3. **tailwindcss**
   - Styling (already in project)

---

## 🔔 Notes

- Admin Sidebar sẽ có thêm menu item "Lịch" → `/admin/calendar`
- Calendar có thể mở rộng sau để:
  - Revenue view
  - Availability analytics
  - Seasonal pricing
  - Recurring blocks (e.g., every Monday closed)

---

## ⏱️ Timeline Estimate

- **Step 1-2:** 3-4 ngày
- **Step 3:** 2 ngày
- **Step 4:** 3-4 ngày
- **Step 5-6:** 2-3 ngày
- **Total:** 1-2 tuần

---

**Status:** ⏳ Not Started
**Priority:** 🔴 High
**Complexity:** 🟠 Medium
