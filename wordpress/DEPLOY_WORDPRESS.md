# Hướng dẫn đưa website Xíu Bread & Coffee lên Hosting WordPress

Dự án đã được cấu hình sẵn **đường dẫn tương đối (`./`)**, **REST API kết nối WordPress**, và đóng gói thành 2 file `.zip` sẵn sàng tải lên hosting:

---

## Cách 1: Cài trực tiếp vào WordPress như Plugin (Khuyên dùng — Lưu đơn hàng & Nhượng quyền vào WP Admin)

1. Tải file **`wordpress/xiu-bread-coffee-plugin.zip`** về máy.
2. Đăng nhập trang quản trị WordPress (**WP Admin**) → **Gói mở rộng (Plugins)** → **Cài mới (Add New)** → **Tải plugin lên (Upload Plugin)** → chọn file `.zip` vừa tải → **Cài đặt** → **Kích hoạt (Activate)**.
3. Trong menu bên trái WP Admin sẽ xuất hiện mục **Xíu Bread & Coffee** (gồm *Đơn hàng*, *Nhượng quyền & B2B*, và *Hướng dẫn gắn trang*).
4. Để hiển thị thành **Trang chủ toàn màn hình** đẹp như bản gốc (không bị header/sidebar theme WordPress làm lệch):
   - Vào **Trang (Pages)** → **Thêm mới**, đặt tên ví dụ `Xíu Bread & Coffee`.
   - Ở thanh bên phải mục **Thuộc tính trang / Template**, chọn **`Xíu Bread & Coffee (Toàn màn hình)`** → bấm **Đăng**.
   - Vào **Cài đặt → Đọc (Settings → Reading)** → chọn trang vừa tạo làm **Trang chủ (Homepage)**.
5. Hoặc nếu muốn chèn vào 1 trang có sẵn của WordPress, chỉ cần dán shortcode `[xiu_bread_coffee]`.

> **Tính năng có sẵn khi cài Plugin:**
> - Đơn đặt món của khách tự động lưu vào **WP Admin → Xíu Bread & Coffee → Đơn hàng**.
> - Hồ sơ đăng ký nhượng quyền / Teabreak tự động lưu vào **WP Admin → Nhượng quyền & B2B**.
> - Tự động gửi email thông báo đơn mới về địa chỉ email quản trị WordPress (`wp_mail`).

---

## Cách 2: Upload trực tiếp lên thư mục gốc hoặc thư mục con trên Hosting WordPress (cPanel / DirectAdmin)

Phù hợp khi bạn muốn chạy độc lập trên domain chính hoặc 1 thư mục con (ví dụ `https://tenmiencuaban.vn/dat-mon/`) mà không đi qua giao diện WordPress:

1. Tải file **`wordpress/xiu-static-hosting.zip`** về máy.
2. Mở **File Manager** trên cPanel/DirectAdmin → vào `public_html/` (hoặc tạo thư mục con `public_html/xiu/`).
3. Upload và **Extract (Giải nén)** file `.zip` (file `.htaccess` đã được đóng gói sẵn để Apache/LiteSpeed nén Gzip, cache ảnh và không bị WordPress Rewrite ghi đè đường dẫn).
4. Truy cập tên miền để kiểm tra.

---

## Lệnh build lại gói khi có chỉnh sửa code
```bash
npm run build:wp
```
Lệnh sẽ biên dịch bản mới nhất và tự cập nhật cả 2 file `.zip` trong thư mục `wordpress/`.
