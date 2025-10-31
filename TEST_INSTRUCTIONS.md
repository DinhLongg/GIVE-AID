# HƯỚNG DẪN TEST LOGIN & REGISTER

## 📋 **BƯỚC 1: START BACKEND**

1. Mở terminal/PowerShell tại thư mục `GIVE-AID/Backend`
2. Chạy lệnh:
   ```bash
   dotnet run
   ```
3. Đợi backend khởi động, bạn sẽ thấy:
   ```
   Now listening on: https://localhost:5230
   Now listening on: http://localhost:5230
   ```
4. Mở browser vào: `http://localhost:5230/swagger` để xem API documentation

---

## 📋 **BƯỚC 2: START FRONTEND**

1. Mở terminal/PowerShell **MỚI** tại thư mục `GIVE-AID/FRONTEND`
2. Chạy lệnh:
   ```bash
   npm run dev
   ```
3. Đợi frontend khởi động, bạn sẽ thấy:
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
4. Mở browser vào: `http://localhost:5173`

---

## 📋 **BƯỚC 3: TEST REGISTER**

1. Vào trang: `http://localhost:5173/register`
2. Điền form:
   - First Name: `Nguyen`
   - Last Name: `Van A`
   - Email: `test@example.com`
   - Phone: `0123456789` (optional)
   - Address: `Hanoi, Vietnam` (optional)
   - Password: `123456` (tối thiểu 6 ký tự)
   - Confirm Password: `123456`
   - ✅ Check "I agree to Terms..."
3. Click nút **"Create Account"**
4. **Kết quả mong đợi:**
   - ✅ Thông báo "Registration Successful!" hiện ra
   - ✅ Token được lưu vào localStorage
   - ✅ Redirect về trang chủ (`/`)

---

## 📋 **BƯỚC 4: TEST LOGIN**

1. Vào trang: `http://localhost:5173/login`
2. Điền form:
   - Email: `test@example.com` (email đã đăng ký ở bước 3)
   - Password: `123456`
3. Click nút **"Sign In"**
4. **Kết quả mong đợi:**
   - ✅ Thông báo "Login Successful!" hiện ra
   - ✅ Token được lưu vào localStorage (hoặc update nếu có sẵn)
   - ✅ Redirect về trang chủ (`/`)

---

## 🐛 **CÁC LỖI CÓ THỂ GẶP VÀ CÁCH FIX**

### **Lỗi 1: CORS Error**
```
Access to XMLHttpRequest at 'http://localhost:5230/api/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Cách fix:**
- Đảm bảo backend đã có CORS configuration (đã thêm vào `Program.cs`)
- Restart backend nếu đang chạy
- Kiểm tra port frontend có trong CORS policy (5173 đã được thêm)

---

### **Lỗi 2: Connection Refused**
```
Network Error: Failed to fetch
```

**Cách fix:**
- Kiểm tra backend đang chạy chưa (`http://localhost:5230`)
- Kiểm tra port trong `api.js` có đúng không (5230)
- Thử mở `http://localhost:5230/swagger` để test backend

---

### **Lỗi 3: Email already exists**
```
Registration Failed: Email already exists
```

**Cách fix:**
- Đây là lỗi hợp lệ - email đã được đăng ký rồi
- Thử email khác: `test2@example.com`
- Hoặc xóa database và tạo lại

---

### **Lỗi 4: Invalid email or password**
```
Login Failed: Invalid email or password
```

**Cách fix:**
- Kiểm tra email và password có đúng không
- Đảm bảo đã đăng ký tài khoản trước
- Kiểm tra password có đủ 6 ký tự không

---

### **Lỗi 5: Password do not match**
```
Validation Error: Passwords do not match
```

**Cách fix:**
- Đảm bảo Password và Confirm Password giống nhau
- Kiểm tra lại khi gõ

---

## ✅ **KIỂM TRA THÀNH CÔNG**

### **Kiểm tra trong Browser Console (F12):**

1. **Mở DevTools** (F12)
2. **Tab Application → Local Storage → http://localhost:5173**
3. Bạn sẽ thấy:
   - `token`: JWT token được lưu (chuỗi dài)
4. **Tab Network:**
   - Xem request `POST /api/auth/register` - Status: 200 OK
   - Xem request `POST /api/auth/login` - Status: 200 OK

---

## 🔍 **TEST THÊM**

### **Test Validation:**
1. Thử submit form trống → Phải hiện lỗi validation
2. Thử password < 6 ký tự → Phải hiện lỗi
3. Thử password != confirmPassword → Phải hiện lỗi

### **Test Error Handling:**
1. Tắt backend → Submit form → Phải hiện lỗi "Connection failed"
2. Đăng ký email đã tồn tại → Phải hiện lỗi từ server
3. Login với email chưa đăng ký → Phải hiện lỗi "Invalid email or password"

---

## 📝 **GHI CHÚ**

- Backend chạy trên port **5230**
- Frontend chạy trên port **5173** (mặc định Vite)
- Token được lưu trong **localStorage** với key `token`
- Sau khi login thành công, token sẽ tự động được thêm vào mọi API request tiếp theo

