# Email Verification Setup Guide

## Vấn đề: Email không được gửi

Nếu bạn không nhận được email verification, có thể do cấu hình SMTP chưa đúng.

## Cách cấu hình Gmail SMTP

### Bước 1: Tạo App Password trên Gmail

1. Truy cập: https://myaccount.google.com/security
2. Bật **2-Step Verification** (nếu chưa bật)
3. Tạo **App Password**:
   - Vào: https://myaccount.google.com/apppasswords
   - Chọn **Mail** và **Other (Custom name)**
   - Đặt tên: "Give-AID"
   - Copy **App Password** (16 ký tự, ví dụ: `xroj czol johl mmfl`)

### Bước 2: Cập nhật appsettings.json

Mở file `GIVE-AID/Backend/appsettings.json` và cập nhật phần `Smtp`:

```json
{
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "User": "your-email@gmail.com",
    "Pass": "xroj czol johl mmfl",
    "From": "your-email@gmail.com"
  }
}
```

**Lưu ý:**
- Thay `your-email@gmail.com` → Email Gmail của bạn
- Thay `xroj czol johl mmfl` → App Password bạn vừa tạo (có thể bỏ khoảng trắng: `xrojczoljohlmmfl`)
- App Password có thể có khoảng trắng hoặc không, cả 2 đều hoạt động

### Bước 3: Restart Backend

Sau khi cập nhật `appsettings.json`, restart backend server:

```bash
# Stop backend (Ctrl+C)
# Rồi chạy lại:
dotnet run
```

### Bước 4: Test Email

Sử dụng endpoint test email để kiểm tra:

**Swagger:**
- Mở: `http://localhost:5230/swagger`
- Tìm: `POST /api/Test/send-email`
- Body: nhập email test
- Click "Execute"

**Postman hoặc Browser Console:**
```javascript
fetch('http://localhost:5230/api/test/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify('your-test-email@gmail.com')
})
.then(r => r.json())
.then(console.log)
```

## Kiểm tra Logs

Khi đăng ký, check console logs của backend:

**Thành công:**
```
[Info] Email sent successfully to user@example.com
[Info] Verification email sent successfully to user@example.com
```

**Thất bại:**
```
[Warning] Email skipped: missing configuration or recipient.
[Warning] Email skipped: SMTP password is not configured.
[Error] Failed to send email: [error message]
```

## Troubleshooting

### 1. Email không đến inbox
- Kiểm tra **Spam/Junk** folder
- Kiểm tra console logs của backend
- Đảm bảo App Password đúng

### 2. Lỗi "Authentication failed"
- App Password sai
- Chưa bật 2-Step Verification
- Copy sai App Password (có khoảng trắng hoặc thiếu ký tự)

### 3. Lỗi "Connection timeout"
- Kiểm tra internet
- Firewall chặn port 587
- Thử dùng port 465 với SSL

### 4. Cấu hình khác SMTP Provider

Nếu dùng email khác Gmail:

**Outlook/Hotmail:**
```json
{
  "Smtp": {
    "Host": "smtp.office365.com",
    "Port": "587",
    "User": "your-email@outlook.com",
    "Pass": "your-password",
    "From": "your-email@outlook.com"
  }
}
```

**Custom SMTP:**
```json
{
  "Smtp": {
    "Host": "smtp.yourdomain.com",
    "Port": "587",
    "User": "your-email@yourdomain.com",
    "Pass": "your-password",
    "From": "your-email@yourdomain.com"
  }
}
```

## Security Note

⚠️ **KHÔNG** commit `appsettings.json` có password lên Git!

- Thêm `appsettings.json` vào `.gitignore`
- Dùng `appsettings.Development.json` cho local development
- Dùng Environment Variables hoặc Azure Key Vault cho production

