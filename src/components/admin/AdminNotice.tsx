export function AdminNotice({
  configured,
  error,
}: {
  configured: boolean;
  error?: string;
}) {
  if (configured && !error) return null;

  return (
    <div className="mb-4 rounded-lg border border-[#f3d19c] bg-[#fff7ed] p-4 text-sm leading-6 text-[#8a4b12]">
      {!configured
        ? "Chưa cấu hình Supabase nên admin không hiển thị dữ liệu thật. Hãy thêm biến môi trường Supabase và tạo tài khoản admin trong Supabase Auth."
        : `Không tải được dữ liệu Supabase: ${error}`}
    </div>
  );
}
