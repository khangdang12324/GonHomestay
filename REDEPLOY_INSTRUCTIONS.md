# 🚀 Hướng dẫn Redeploy Admin Login trên Vercel

## 1️⃣ Kiểm tra và cấu hình Environment Variables trên Vercel

**Bước 1:** Truy cập vào Vercel Dashboard
- Vào [vercel.com](https://vercel.com)
- Chọn project `gon-home-app` hoặc `gonhomestay`

**Bước 2:** Truy cập Settings → Environment Variables

**Bước 3:** Thêm/kiểm tra các biến sau (SỰ CÓ 4 BIẾN)

### ✅ Biến công khai (Public):
```
NEXT_PUBLIC_SUPABASE_URL
Value: https://piefirptymyhhtxrvwyv.supabase.co
Environments: Production, Preview, Development (chọn tất cả)

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_2lIRTpaLeoxKEkHme6pH6Q_tKKfSTpx
Environments: Production, Preview, Development (chọn tất cả)

NEXT_PUBLIC_ADMIN_EMAIL (tùy chọn)
Value: pandorakhang@gmail.com
Environments: Production, Preview, Development (chọn tất cả)
```

### ✅ Biến riêng (Secret):
```
SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZWZpcnB0eW15aGh0eHJ2d3l2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTExNTg4NCwiZXhwIjoyMDk2NjkxODg0fQ.hipbW41XmpdT8p-J_7f-j8ssea89KT4tYcFzjuxRCBQ
Environments: Production, Preview, Development (chọn tất cả)
```

**Bước 4:** Lưu tất cả biến (Save)

## 2️⃣ Redeploy trên Vercel

### Cách 1: Auto Redeploy từ GitHub (nhanh nhất)
Vì code đã được push lên GitHub, Vercel sẽ tự động trigger deploy.
- Vào Deployments tab
- Xem deployment mới nhất (trong vài phút)
- Chờ cho đến khi status là "Ready" (xanh)

### Cách 2: Manual Redeploy
1. Vào **Deployments** tab
2. Chọn latest deployment (top nhất)
3. Click **Redeploy** button (góc phải)
4. Chọn **Use existing Build Cache** hoặc **Clear Build Cache** (khuyến nghị chọn **Clear Build Cache** nếu vẫn lỗi)
5. Chờ deploy hoàn thành (2-3 phút)

## 3️⃣ Test Admin Login

Khi deployment thành công (status = "Ready"):

1. **Truy cập trang admin:** 
   ```
   https://gonhomestay-xxx.vercel.app/admin/login
   ```

2. **Điền thông tin đăng nhập:**
   - Email: `pandorakhang@gmail.com` (hoặc email admin của bạn)
   - Password: mật khẩu của tài khoản Supabase Auth

3. **Kiểm tra Supabase:**
   - Đảm bảo user tồn tại trong `auth.users`
   - User này phải có record trong bảng `profiles` với `role = 'admin'`

## 4️⃣ Troubleshooting

### ❌ Lỗi: "Chưa cấu hình Supabase"
- **Nguyên nhân:** Environment variables chưa được set trên Vercel
- **Giải pháp:** Quay lại bước 1, kiểm tra lại các biến và **Redeploy**

### ❌ Lỗi: "Email hoặc mật khẩu không đúng"
- **Kiểm tra:**
  1. User tồn tại trong Supabase `auth.users`?
  2. Mật khẩu có đúng không?
  3. Vào Supabase Dashboard → Authentication → Users để xác nhân

### ❌ Lỗi: "Tài khoản này không có quyền admin"
- **Kiểm tra:**
  1. Vào Supabase → Database → `profiles` table
  2. Tìm user có id giống user vừa login
  3. Kiểm tra column `role` = 'admin'?
  4. Nếu không, update: `UPDATE profiles SET role = 'admin' WHERE id = '[user_id]'`

### ❌ Build vẫn lỗi
1. Xóa node_modules và .next locally:
   ```bash
   rm -r node_modules .next
   npm install
   npm run build
   ```
2. Push lên GitHub lại
3. Trigger Manual Redeploy với "Clear Build Cache"

### ❌ Cookies không lưu được
- Đảm bảo browser không block cookies
- Xóa cookies cũ: DevTools → Application → Cookies → Clear all
- Thử lại

## 5️⃣ Quy trình Login hoạt động

```
1. User vào /admin/login → hiển thị form
2. User submit form → POST /api/admin/login
3. API xác thực với Supabase Auth
4. API kiểm tra user có role 'admin'
5. API set session cookies
6. Frontend redirect → /admin
7. Proxy (proxy.ts) refresh session
8. Admin dashboard load thành công
```

## 📞 Nếu vẫn lỗi

1. **Kiểm tra Vercel logs:**
   - Vào Deployments → chọn deployment
   - Tab "Logs" → xem error messages
   
2. **Kiểm tra browser console (F12):**
   - Network tab → xem request `/api/admin/login`
   - Status code là gì? Response body là gì?
   
3. **Kiểm tra Supabase:**
   - Vào https://app.supabase.com
   - Database → profiles table
   - Kiểm tra có record của user không, role có đúng không?

---

**Tóm tắt:** Chỉ cần set 4 environment variables trên Vercel → Redeploy → Đăng nhập thử!
