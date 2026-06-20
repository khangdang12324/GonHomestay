# Hướng dẫn cấu hình Admin trên Vercel

## Vấn đề

Không thể truy cập trang admin khi deploy lên Vercel.

## Nguyên nhân

1. **Biến môi trường không được cấu hình trên Vercel**
2. **Cookies session không được duy trì đúng cách**
3. **Không có middleware để làm mới session**

## Giải pháp

### 1. Kiểm tra biến môi trường trên Vercel

Đảm bảo các biến môi trường sau được set trên Vercel Dashboard:

**Biến công khai (NEXT_PUBLIC):**

- `NEXT_PUBLIC_SUPABASE_URL`: URL của Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key của Supabase
- `NEXT_PUBLIC_ADMIN_EMAIL`: Email admin (tùy chọn, chỉ để điền sẵn vào form)

**Biến riêng tư (Server-only):**

- `SUPABASE_SERVICE_ROLE_KEY`: Service role key của Supabase

### 2. Cách set environment variables trên Vercel

**Bước 1:** Vào Vercel Dashboard → Chọn project → Settings → Environment Variables

**Bước 2:** Thêm từng biến:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
NEXT_PUBLIC_ADMIN_EMAIL = pandorakhang@gmail.com
```

**Bước 3:** Chọn môi trường (Production, Preview, Development) - khuyến nghị select tất cả
**Bước 4:** Lưu (Save)

### 3. Cập nhật code

Các cập nhật sau đã được thực hiện:

- ✅ Tạo middleware tại `src/middleware.ts` để làm mới session
- ✅ Cải thiện route handler login tại `src/app/api/admin/login/route.ts`

### 4. Deploy lại

Sau khi set environment variables, cần re-deploy:

1. Vào Vercel Dashboard
2. Project → Deployments → chọn latest deployment
3. Click "Redeploy" hoặc push code mới lên GitHub

## Quy trình đăng nhập

1. User điền email/password vào form `/admin/login`
2. Form gửi POST đến `/api/admin/login`
3. Route handler xác thực với Supabase Auth
4. Kiểm tra user có role `admin` trong bảng `profiles`
5. Set session cookies
6. Frontend redirect tới `/admin`
7. Middleware (`src/middleware.ts`) làm mới session
8. Trang `/admin` verify session và hiển thị dashboard

## Troubleshooting

### Nếu vẫn không vào được admin:

1. Kiểm tra Console browser (F12 → Network tab)
   - Xem request `/api/admin/login` có status 200 không
   - Xem Set-Cookie headers có được trả về không
2. Kiểm tra Vercel logs:
   - Vào Vercel Dashboard → Deployments → View Logs
   - Tìm lỗi trong logs khi access `/admin`

3. Xóa cookies và thử lại:
   - Mở DevTools → Application → Cookies → Xóa tất cả
   - Đăng nhập lại

4. Kiểm tra Supabase:
   - Vào Supabase Dashboard
   - Xem profile của user có role `admin` không
   - Xem JWT tokens có valid không

### Email đầu có thể khác

Nếu trong `.env.local` có `NEXT_PUBLIC_ADMIN_EMAIL=pandorakhang@gmail.com`
nhưng trên Vercel không set, thì form sẽ không điền sẵn email (nhưng vẫn hoạt động bình thường).
