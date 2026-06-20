# 🔧 Hướng Dẫn Troubleshooting Localhost

## ⚠️ Lỗi: "Internal Server Error"

### 🔍 Nguyên Nhân Có Thể

1. **Supabase không được cấu hình** → `.env.local` chưa có keys
2. **Database query lỗi** → Booking table không có dữ liệu hoặc schema sai
3. **Middleware/Proxy lỗi** → Next.js proxy.ts có issue
4. **Route handler lỗi** → API endpoint crash

---

## 🚀 Cách Debug Trên Localhost

### Bước 1: Kiểm tra Environment Variables

Kiểm tra `.env.local` có đầy đủ:

```bash
# .env.local phải có:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Nếu không có → Thêm từ [Supabase Dashboard](https://app.supabase.com) → Project Settings

### Bước 2: Kiểm tra Health Check

Truy cập endpoint debug:

```
http://localhost:3000/api/debug/health-check
```

**Kết quả thành công:**
```json
{
  "config": {
    "adminClientExists": true,
    "serverClientExists": true,
    "envVars": {
      "NEXT_PUBLIC_SUPABASE_URL": true,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": true,
      "SUPABASE_SERVICE_ROLE_KEY": true
    }
  },
  "bookingsTest": {
    "success": true,
    "count": 5
  },
  "bookingsError": null,
  "timestamp": "2026-06-20T11:30:00Z"
}
```

**Kết quả lỗi:**
```json
{
  "config": { ... },
  "bookingsTest": null,
  "bookingsError": {
    "code": "PGRST116",
    "message": "..." 
  }
}
```

### Bước 3: Xóa Cache & Restart

```bash
# Xóa cache
rm -r .next
rm -r node_modules/.cache

# Restart dev server
npm run dev
```

---

## 🐛 Debug Từng Page

### `/admin/bookings` bị lỗi?

1. Kiểm tra `http://localhost:3000/api/debug/health-check`
2. Xem có booking trong database không
3. Mở DevTools (F12) → Network → Xem request bookings
4. Kiểm tra error response

### `/admin/bookings/[id]` bị 404?

1. Tìm booking ID thực từ `/admin/bookings` list
2. Copy ID và vào URL: `/admin/bookings/{id}`
3. Nếu vẫn 404 → ID không tồn tại trong DB

### `/admin/calendar` bị lỗi?

1. Kiểm tra bookings & rooms có dữ liệu
2. Xem CalendarView component render đúng không

---

## 📋 Danh Sách URL Để Test

| URL | Dùng Để |
|-----|---------|
| `http://localhost:3000/api/debug/health-check` | ✅ Check config & DB |
| `http://localhost:3000/admin/login` | ✅ Test login |
| `http://localhost:3000/admin` | ✅ Dashboard |
| `http://localhost:3000/admin/bookings` | ✅ Booking list |
| `http://localhost:3000/admin/calendar` | ✅ Calendar view |
| `http://localhost:3000/booking` | ✅ Public form |

---

## 🧪 Test Full Flow

### 1. Đăng Nhập Admin
```
URL: http://localhost:3000/admin/login
Email: dangkhang.120304@gmail.com
Password: (mật khẩu Supabase)
```

### 2. Xem Booking List
```
URL: http://localhost:3000/admin/bookings
→ Thấy list bookings không?
```

### 3. Xem Chi Tiết Booking
```
URL: http://localhost:3000/admin/bookings/{booking_id}
→ Copy ID từ bước 2
→ Thấy form chỉnh sửa không?
```

### 4. Test Calendar
```
URL: http://localhost:3000/admin/calendar
→ Thấy lịch và bookings không?
```

### 5. Test Public Booking Form
```
URL: http://localhost:3000/booking
→ Điền ngày
→ Kiểm tra availability check
```

---

## 🛠️ Common Errors

### Error: "Supabase chưa được cấu hình"

**Nguyên nhân:** Env vars không được load  
**Giải pháp:**
1. Kiểm tra `.env.local` có đầy đủ keys
2. Restart dev server: `npm run dev`
3. Xóa cache: `rm -r .next`

### Error: "PGRST116: Not found"

**Nguyên nhân:** Booking ID không tồn tại  
**Giải pháp:**
1. Kiểm tra ID có đúng không
2. Xem booking có trong database không
3. Dùng Supabase Dashboard xác nhận

### Error: "Unauthorized"

**Nguyên nhân:** Session không hợp lệ  
**Giải pháp:**
1. Xóa cookies: DevTools → Application → Cookies → Clear all
2. Đăng nhập lại
3. Xem Supabase auth tokens hợp lệ

### Error: "Cannot POST /api/..."

**Nguyên nhân:** Route handler chưa tạo  
**Giải pháp:**
1. Kiểm tra file route.ts tồn tại không
2. Kiểm tra export function với HTTP method đúng

---

## 📊 Database Checks

### Xem Có Booking Không?

Supabase Dashboard → SQL Editor:

```sql
SELECT COUNT(*) FROM bookings;
SELECT * FROM bookings LIMIT 5;
```

### Xem Có User Admin Không?

```sql
SELECT * FROM auth.users WHERE email = 'dangkhang.120304@gmail.com';
SELECT * FROM profiles WHERE id = '{user_id}' AND role = 'admin';
```

### Xem Schema Đúng Không?

```sql
-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings';
```

---

## 🎯 Quick Fixes

### Fix 1: Clear Everything & Restart

```bash
# Terminal
rm -r .next
rm -r node_modules/.cache
npm run dev
```

### Fix 2: Check Env Vars

```bash
# Terminal - check if env vars loaded
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Fix 3: Test Supabase Connection

```bash
# Terminal - curl test
curl https://piefirptymyhhtxrvwyv.supabase.co/rest/v1/bookings \
  -H "apikey: sb_publishable_2lIRTpaLeoxKEkHme6pH6Q_tKKfSTpx" \
  -H "Authorization: Bearer sb_publishable_2lIRTpaLeoxKEkHme6pH6Q_tKKfSTpx"
```

---

## 💡 Tips

- **Always check health-check endpoint first** → `/api/debug/health-check`
- **Use DevTools Network tab** → See exact error responses
- **Check Vercel logs** → Go to Vercel Dashboard → Deployments → Logs
- **Check Supabase logs** → Go to Supabase Dashboard → Logs
- **Restart dev server** → Many issues fix with restart

---

## 📞 If Still Stuck

1. ✅ Run `/api/debug/health-check` and share the result
2. ✅ Check Supabase Dashboard → Database → bookings table has data
3. ✅ Check `.env.local` has all required keys
4. ✅ Restart terminal and dev server
5. ✅ Check browser console (F12 → Console tab)

---

**Last Updated:** 2026-06-20
