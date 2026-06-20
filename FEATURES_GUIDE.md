# 📋 Hướng Dẫn Các Tính Năng Booking Mới

## 🎯 Tính Năng Được Thêm

### 1️⃣ Chi Tiết Đặt Phòng (Booking Details)
Cho phép admin xem và chỉnh sửa thông tin chi tiết của từng booking.

**Vị trí:** Admin Panel → Quản lý đặt phòng → Click "Chi tiết"

**Tính năng:**
- ✅ Xem đầy đủ thông tin booking: tên, SĐT, email, ngày check-in/out, số khách, tổng tiền
- ✅ Chỉnh sửa thông tin khách hàng
- ✅ Thay đổi trạng thái booking (Chờ xác nhận → Đã xác nhận → Đã nhận phòng → Đã trả phòng)
- ✅ Thêm/chỉnh sửa ghi chú
- ✅ Xóa booking

**Quy trình sử dụng:**
1. Vào **Admin** → **Quản lý đặt phòng**
2. Tìm booking cần quản lý
3. Click nút **Chi tiết** (xanh)
4. Chỉnh sửa thông tin cần thiết
5. Click **Lưu thay đổi** hoặc **Xóa booking**

---

### 2️⃣ Chặn Đặt Phòng Trùng Ngày (Double Booking Prevention)
Tự động kiểm tra xem ngày khách muốn đặt có bị trùng với booking đã xác nhận không.

**Vị trí:** Public Site → Form Đặt Phòng

**Tính năng:**
- ✅ Khi khách điền ngày check-in/out, hệ thống tự động kiểm tra
- ✅ Nếu ngày không bị trùng → **Xanh: "Phòng còn trống"**
- ✅ Nếu ngày bị trùng → **Đỏ: "Phòng đã được đặt bởi [tên khách]"**
- ✅ Nút "Gửi yêu cầu" sẽ bị vô hiệu hóa nếu ngày bị trùng

**Cách hoạt động:**
1. Khách truy cập `/booking` hoặc form đặt phòng
2. Điền ngày check-in
3. Điền ngày check-out
4. Hệ thống **tự động kiểm tra** availability (không cần nhấn nút)
5. Thấy kết quả trước khi submit form

**Logic kiểm tra:**
- ✅ Chỉ kiểm tra booking có status = **"CONFIRMED"** (Đã xác nhận)
- ✅ Bỏ qua booking với status PENDING, CANCELLED
- ✅ Bỏ qua booking đã CHECKED_OUT rồi

---

## 🔄 Trạng Thái Booking

Booking có 5 trạng thái chính:

| Trạng thái | Mô tả | Có thể chuyển sang |
|-----------|-------|-------------------|
| **PENDING** | Chờ xác nhận | CONFIRMED, CANCELLED |
| **CONFIRMED** | Đã xác nhận | CHECKED_IN, CANCELLED |
| **CHECKED_IN** | Đã nhận phòng | CHECKED_OUT, CANCELLED |
| **CHECKED_OUT** | Đã trả phòng | (không thay đổi) |
| **CANCELLED** | Đã hủy | (không thay đổi) |

**Cách thay đổi trạng thái:**
1. Vào chi tiết booking
2. Chọn trạng thái mới từ dropdown "Trạng thái"
3. Click **Lưu thay đổi**

---

## 📊 Database

### Bảng `bookings` - Các field
```
id: UUID (primary key)
customer_name: Text
customer_phone: Text
customer_email: Text (nullable)
check_in: Date
check_out: Date
guests: Integer
total_price: Integer (nullable)
status: Text (PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
note: Text (nullable)
source: Text (Facebook, Google, etc.)
room_id: UUID (nullable, references rooms)
created_at: Timestamp
updated_at: Timestamp
```

---

## 🔌 API Endpoints

### GET `/api/bookings/available-dates`
Kiểm tra xem ngày booking có trống không.

**Query Parameters:**
```
checkIn: YYYY-MM-DD (required)
checkOut: YYYY-MM-DD (required)
roomId: UUID (optional)
```

**Example:**
```
GET /api/bookings/available-dates?checkIn=2026-07-01&checkOut=2026-07-05
```

**Response:**
```json
{
  "available": true,
  "message": "Phòng còn trống"
}
```
hoặc
```json
{
  "available": false,
  "message": "Phòng đã được đặt bởi Nguyễn Văn A"
}
```

---

## 🛠️ Cấu Trúc Code

### File mới được tạo:
1. **`src/app/admin/bookings/[id]/page.tsx`**
   - Page chi tiết booking

2. **`src/components/admin/BookingDetailForm.tsx`**
   - Form chỉnh sửa booking

3. **`src/server/booking-actions.ts`**
   - Server actions: updateBooking, deleteBooking, checkAvailableDates

4. **`src/app/api/bookings/available-dates/route.ts`**
   - API endpoint kiểm tra availability

### File được cập nhật:
1. **`src/server/admin-data.ts`**
   - Thêm hàm `getBookingById()`

2. **`src/components/admin/BookingTable.tsx`**
   - Thêm link tới trang chi tiết booking

3. **`src/components/site/BookingForm.tsx`**
   - Thêm kiểm tra availability real-time

4. **`src/data/constants.ts`**
   - Thêm `bookingStatusOrder` constant

---

## 📈 Kế Hoạch Tiếp Theo

### Phase 4: Calendar Management (đang lên kế hoạch)
- [ ] Tạo page `/admin/calendar`
- [ ] Hiển thị lịch các phòng
- [ ] Quản lý trạng thái phòng (mở/đóng/bảo trì)
- [ ] Drag & drop để thay đổi ngày booking
- [ ] Export calendar

### Đặc điểm khác (tương lai):
- [ ] Auto-decline PENDING booking sau X ngày
- [ ] SMS/Email notification
- [ ] Multi-room management
- [ ] Revenue analytics
- [ ] Guest history

---

## ❓ Troubleshooting

### Lỗi: "Phòng đã được đặt" nhưng không thấy booking
→ Kiểm tra status của booking, chỉ CONFIRMED mới bị chặn

### Lỗi: Không thể update booking
→ Kiểm tra Vercel logs hoặc browser console

### Lỗi: API availability không hoạt động
→ Xóa cache browser (F12 → Application → Clear Storage)

---

## 📞 Support
Nếu có lỗi, kiểm tra:
1. Browser Console (F12 → Console tab)
2. Vercel Logs (Dashboard → Deployments → Logs)
3. Supabase Logs (app.supabase.com → Logs)
