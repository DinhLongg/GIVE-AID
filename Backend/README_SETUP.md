# Hướng dẫn Setup Database Configuration

## Vấn đề
Khi làm việc nhóm, mỗi thành viên có SQL Server khác nhau (tên máy, user, password), nên khi pull code về phải đổi lại connection string rất mất thời gian.

## Giải pháp
Sử dụng `appsettings.Development.json` để mỗi thành viên có cấu hình riêng mà không ảnh hưởng đến code chung.

---

## Các bước thực hiện

### Bước 1: Tạo file `appsettings.Development.json`

1. Copy file `appsettings.example.json` trong thư mục `Backend/`
2. Đổi tên thành `appsettings.Development.json` (đặt trong cùng thư mục `Backend/`)

### Bước 2: Cấu hình SQL Server của bạn

Mở file `appsettings.Development.json` và sửa phần `ConnectionStrings`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=Give_AID_API_Db;User Id=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  }
}
```

**Thay thế các giá trị:**
- `YOUR_SERVER_NAME`: Tên server SQL của bạn
  - Ví dụ: `DESKTOP-D6519VR\SQLEXPRESS` hoặc `localhost` hoặc `localhost\SQLEXPRESS`
  - **Lưu ý:** Nếu có dấu `\` thì phải dùng `\\` (2 dấu backslash) trong JSON
- `YOUR_USER`: Username SQL của bạn (thường là `sa`)
- `YOUR_PASSWORD`: Password SQL của bạn

**Ví dụ:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-D6519VR\\SQLEXPRESS;Database=Give_AID_API_Db;User Id=sa;Password=1234;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  }
}
```

### Bước 3: Cấu hình các settings khác (tùy chọn)

Nếu bạn muốn override các settings khác trong `appsettings.json`, có thể thêm vào `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=Give_AID_API_Db;User Id=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  },
  "Admin": {
    "Email": "your_admin_email@example.com",
    "Username": "admin",
    "Password": "YourPassword123",
    "FullName": "Your Admin Name"
  },
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "User": "your_email@gmail.com",
    "Pass": "your_app_password",
    "From": "your_email@gmail.com"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

---

## Cách hoạt động

1. **`appsettings.json`**: File chung, chứa cấu hình mặc định (commit vào Git)
2. **`appsettings.Development.json`**: File riêng của mỗi thành viên (KHÔNG commit vào Git)
3. Khi chạy ở **Development mode**, ASP.NET Core tự động:
   - Load `appsettings.json` trước
   - Sau đó load `appsettings.Development.json` và override các giá trị trùng lặp

---

## Lợi ích

✅ Mỗi thành viên có cấu hình riêng, không conflict khi pull/push code  
✅ Không cần đổi lại connection string sau mỗi lần pull  
✅ Bảo mật hơn (password không commit vào Git)  
✅ Dễ setup cho thành viên mới  

---

## Lưu ý quan trọng

⚠️ **File `appsettings.Development.json` đã được thêm vào `.gitignore`**, nên:
- File này sẽ KHÔNG được commit lên Git
- Mỗi thành viên cần tự tạo file này trên máy của mình
- Sau khi pull code, file này vẫn giữ nguyên (không bị ghi đè)

⚠️ **Nếu bạn thay đổi password admin trong `appsettings.Development.json`**:
- Password chỉ có hiệu lực khi admin user được seed lần đầu
- Nếu admin đã tồn tại, password sẽ KHÔNG tự động cập nhật (vì lý do bảo mật)
- Cần đổi password thủ công qua trang Profile admin hoặc SQL script

---

## Kiểm tra kết nối

Sau khi cấu hình xong, chạy ứng dụng và kiểm tra:
1. Application có kết nối được với database không
2. Check console/logs xem có lỗi connection không
3. Nếu có lỗi, kiểm tra lại:
   - Tên server có đúng không
   - Username/Password có đúng không
   - SQL Server có đang chạy không
   - Database `Give_AID_API_Db` đã được tạo chưa (nếu chưa, chạy migration)

---

## Troubleshooting

### Lỗi: "Cannot connect to server"
- Kiểm tra SQL Server đang chạy: Mở SQL Server Configuration Manager
- Kiểm tra SQL Server Browser service đang chạy
- Thử kết nối bằng SQL Server Management Studio với thông tin tương tự

### Lỗi: "Login failed for user"
- Kiểm tra lại username và password
- Đảm bảo SQL Server Authentication đã được enable
- Kiểm tra user có quyền truy cập database không

### Lỗi: "Invalid object name"
- Database chưa được tạo hoặc chưa chạy migration
- Chạy: `dotnet ef database update` trong thư mục Backend

---

## Hỗ trợ

Nếu gặp vấn đề, liên hệ team lead hoặc xem documentation trong project.

