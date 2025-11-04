# Cách Tạo Tài Khoản Admin

Có 3 cách để tạo tài khoản Admin:

## Cách 1: Tự động tạo khi khởi động ứng dụng (Khuyến nghị)

Ứng dụng sẽ **tự động tạo admin user** khi khởi động nếu chưa có admin nào trong database.

### Cấu hình Admin Credentials

Bạn có thể tùy chỉnh email, username và password của admin trong file `appsettings.json`:

```json
"Admin": {
  "Email": "your-admin@example.com",
  "Username": "your-admin-username",
  "Password": "YourSecurePassword123",
  "FullName": "Your Admin Name"
}
```

**Thông tin đăng nhập mặc định (nếu không cấu hình):**
- **Email:** `admin@giveaid.com`
- **Username:** `admin`
- **Password:** `Admin@123`
- **FullName:** `Administrator`

⚠️ **LƯU Ý:** 
- Thay đổi cấu hình trong `appsettings.json` TRƯỚC KHI chạy ứng dụng lần đầu tiên
- **Nếu admin đã được tạo với password cũ:**
  - Cách 1: Xóa admin cũ trong database (chạy script `DeleteAdminUser.sql`), rồi restart backend
  - Cách 2: Đăng nhập với password cũ, vào `/profile` để đổi mật khẩu
  - Cách 3: Sử dụng chức năng "Forgot Password" để reset mật khẩu
- Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên!

## Cách 2: Nâng cấp user hiện có thành Admin

Nếu bạn đã có tài khoản và muốn nâng cấp thành Admin, có 2 cách:

### A. Qua Admin Dashboard (nếu đã có Admin khác)
1. Đăng nhập với tài khoản Admin hiện có
2. Vào trang `/admin/users`
3. Tìm user muốn nâng cấp
4. Click "View" → Chọn role "Admin" → Lưu

### B. Qua SQL trực tiếp
```sql
UPDATE Users 
SET Role = 'Admin' 
WHERE Email = 'your-email@example.com';
```

## Cách 3: Tạo Admin thủ công qua SQL (không khuyến nghị)

Nếu muốn tạo admin thủ công, bạn cần:

1. Generate BCrypt hash cho password `Admin@123`
2. Chạy script SQL trong file `CreateAdminUser.sql`

**Cách generate BCrypt hash:**
- Sử dụng online tool: https://bcrypt-generator.com/
- Hoặc sử dụng BCrypt.Net trong C#: `BCrypt.Net.BCrypt.HashPassword("Admin@123")`

---

## Kiểm tra Admin đã được tạo

Chạy SQL query sau để kiểm tra:
```sql
SELECT Id, FullName, Username, Email, Role, EmailVerified 
FROM Users 
WHERE Role = 'Admin';
```

---

## Đổi mật khẩu Admin

Sau khi đăng nhập lần đầu, bạn nên:
1. Vào `/admin/users`
2. Tìm admin user của bạn
3. Hoặc vào `/profile` để đổi mật khẩu

Hoặc sử dụng chức năng "Forgot Password" nếu cần reset mật khẩu.

