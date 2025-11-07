# Give-AID - Tài Liệu Kỹ Thuật Cho Developers

> **Đối tượng**: Developers mới vào team  
> **Cập nhật lần cuối**: Tháng 11/2024  
> **Ngôn ngữ**: Tiếng Việt (với thuật ngữ tiếng Anh)

---

## Mục Lục

- [1. Tổng Quan Kiến Trúc Hệ Thống](#1-tổng-quan-kiến-trúc-hệ-thống)
- [2. Cấu Trúc Thư Mục & File Quan Trọng](#2-cấu-trúc-thư-mục--file-quan-trọng)
- [3. Backend Deep Dive](#3-backend-deep-dive)
- [4. Frontend Deep Dive](#4-frontend-deep-dive)
- [5. Database Schema & Migrations](#5-database-schema--migrations)
- [6. Authentication & Authorization Flow](#6-authentication--authorization-flow)
- [7. Luồng Xử Lý Các Tính Năng Chính](#7-luồng-xử-lý-các-tính-năng-chính)
- [8. Email System](#8-email-system)
- [9. Hướng Dẫn Debugging](#9-hướng-dẫn-debugging)
- [10. Best Practices & Onboarding Checklist](#10-best-practices--onboarding-checklist)

---

## 1. Tổng Quan Kiến Trúc Hệ Thống

### 1.1 Sơ Đồ Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React Application (Port 5173)                    │  │
│  │  - React 18.3 với Hooks                                  │  │
│  │  - React Router DOM 7.0                                  │  │
│  │  - Axios 1.7 (HTTP Client)                               │  │
│  │  - Bootstrap 5 (UI Framework)                            │  │
│  │  - localStorage (JWT Token Storage)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (JSON + JWT Token)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      ASP.NET Core 8.0 Web API (Port 5230)                │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Pipeline:                              │  │  │
│  │  │  1. CORS (Allow Frontend)                          │  │  │
│  │  │  2. Authentication (JWT Bearer)                    │  │  │
│  │  │  3. Authorization (Role-based)                     │  │  │
│  │  │  4. Routing → Controllers                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Controllers → Services → DbContext               │  │  │
│  │  │  - AuthController                                  │  │  │
│  │  │  - DonationController                              │  │  │
│  │  │  - ProgramController                               │  │  │
│  │  │  - AdminController                                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Entity Framework Core 9.0
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         SQL Server Database                              │  │
│  │  - Users, Donations, Programs, NGOs, ...                 │  │
│  │  - Relationships & Constraints                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SMTP (Fire-and-forget)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - SMTP Server (Gmail/Outlook)                          │  │
│  │    → Send verification emails                            │  │
│  │    → Send donation receipts                              │  │
│  │    → Send password reset links                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Luồng Request Chi Tiết (Sequence Diagram)

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│   User   │      │ Frontend │      │  Backend │      │Database  │      │   SMTP   │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │                  │                  │
     │ (1) Click       │                  │                  │                  │
     │  "Donate"       │                  │                  │                  │
     ├────────────────>│                  │                  │                  │
     │                 │                  │                  │                  │
     │                 │ (2) Form Submit  │                  │                  │
     │                 │  (Validate)      │                  │                  │
     │                 │                  │                  │                  │
     │                 │ (3) POST /api/   │                  │                  │
     │                 │  donation        │                  │                  │
     │                 │  + JWT Token     │                  │                  │
     │                 ├─────────────────>│                  │                  │
     │                 │                  │                  │                  │
     │                 │                  │ (4) Validate JWT │                  │
     │                 │                  │  (Check token)   │                  │
     │                 │                  ├─────────────────>│                  │
     │                 │                  │  (Verify user)   │                  │
     │                 │                  │<─────────────────┤                  │
     │                 │                  │                  │                  │
     │                 │                  │ (5) Validate DTO │                  │
     │                 │                  │  (ModelState)    │                  │
     │                 │                  │                  │                  │
     │                 │                  │ (6) Business     │                  │
     │                 │                  │  Logic           │                  │
     │                 │                  │  (DonationService│                  │
     │                 │                  │   .CreateAsync)  │                  │
     │                 │                  │                  │                  │
     │                 │                  │ (7) Save to DB   │                  │
     │                 │                  ├─────────────────>│                  │
     │                 │                  │  INSERT INTO     │                  │
     │                 │                  │  Donations       │                  │
     │                 │                  │<─────────────────┤                  │
     │                 │                  │  (Saved, ID=42)  │                  │
     │                 │                  │                  │                  │
     │                 │                  │ (8) Send Email   │                  │
     │                 │                  │  (Fire & Forget) │                  │
     │                 │                  ├────────────────────────────────────>│
     │                 │                  │  (Email sent)    │                  │
     │                 │                  │                  │                  │
     │                 │                  │ (9) Return 200   │                  │
     │                 │                  │  OK + Donation   │                  │
     │                 │<─────────────────┤                  │                  │
     │                 │  JSON Response   │                  │                  │
     │                 │                  │                  │                  │
     │                 │ (10) Update UI   │                  │                  │
     │                 │  (Show toast,    │                  │                  │
     │                 │   navigate)      │                  │                  │
     │<────────────────┤                  │                  │                  │
     │ Success Message │                  │                  │                  │
```

### 1.3 Technology Stack

**Backend:**
- **Framework**: ASP.NET Core 8.0
- **Language**: C# 12.0
- **ORM**: Entity Framework Core 9.0
- **Database**: SQL Server (LocalDB / SQL Server Express / Full SQL Server)
- **Authentication**: JWT Bearer Tokens (HS256)
- **Email**: SmtpClient (System.Net.Mail)
- **Documentation**: Swagger/OpenAPI (Swashbuckle)

**Frontend:**
- **Framework**: React 18.3 (Functional Components + Hooks)
- **Build Tool**: Vite 6.0
- **Router**: React Router DOM 7.0
- **HTTP Client**: Axios 1.7
- **UI Framework**: Bootstrap 5.3
- **Icons**: Font Awesome 6.0
- **Animations**: AOS (Animate On Scroll) 3.0
- **Notifications**: 
  - React Toastify 11.0 (Toast notifications)
  - SweetAlert2 11.15 (Modal dialogs)

**Development Tools:**
- **IDE**: Visual Studio 2022 / VS Code
- **Version Control**: Git
- **API Testing**: Swagger UI, Postman
- **Database Management**: SQL Server Management Studio (SSMS)

---

## 2. Cấu Trúc Thư Mục & File Quan Trọng

### 2.1 Backend Structure (Chi Tiết)

```
Backend/
│
├── Program.cs                                    # Dòng 1-117
│   └── Entry point: DI container, middleware, startup
│
├── appsettings.json                              # Cấu hình mặc định (commit vào Git)
├── appsettings.example.json                      # Template cấu hình (commit vào Git)
├── appsettings.Development.json                  # Cấu hình cá nhân (GITIGNORED)
│
├── Controllers/                                  # API Endpoints (HTTP handlers)
│   ├── AuthController.cs                        # Dòng 1-205
│   │   └── /api/auth/* endpoints
│   ├── DonationController.cs                    # Dòng 1-130
│   │   └── /api/donation/* endpoints
│   ├── ProgramController.cs                     # Dòng 1-xxx
│   │   └── /api/program/* endpoints
│   ├── AdminController.cs                       # Dòng 1-xxx
│   │   └── /api/admin/* endpoints (Admin only)
│   ├── ProfileController.cs                     # Dòng 1-xxx
│   │   └── /api/profile/* endpoints (User only)
│   ├── NGOController.cs                         # Dòng 1-xxx
│   │   └── /api/ngo/* endpoints
│   ├── PartnerController.cs                     # Dòng 1-xxx
│   │   └── /api/partner/* endpoints
│   ├── GalleryController.cs                     # Dòng 1-xxx
│   │   └── /api/gallery/* endpoints
│   ├── QueryController.cs                       # Dòng 1-xxx
│   │   └── /api/query/* endpoints
│   ├── AboutController.cs                       # Dòng 1-xxx
│   │   └── /api/about/* endpoints
│   └── InvitationController.cs                  # Dòng 1-xxx
│       └── /api/invitation/* endpoints
│
├── Services/                                     # Business Logic Layer
│   ├── AuthService.cs                           # Dòng 1-527
│   │   └── Registration, login, email verification, password reset
│   ├── DonationService.cs                       # Dòng 1-190
│   │   └── Donation processing, email confirmation
│   ├── ProgramService.cs                        # Dòng 1-xxx
│   │   └── Program management, stats, registration
│   ├── EmailService.cs                          # Dòng 1-xxx
│   │   └── SMTP email sending
│   ├── UserService.cs                           # Dòng 1-xxx
│   │   └── User CRUD operations
│   ├── NGOService.cs                            # Dòng 1-xxx
│   ├── PartnerService.cs                        # Dòng 1-xxx
│   ├── GalleryService.cs                        # Dòng 1-xxx
│   ├── QueryService.cs                          # Dòng 1-xxx
│   ├── AboutService.cs                          # Dòng 1-xxx
│   ├── ProfileService.cs                        # Dòng 1-xxx
│   └── InvitationService.cs                     # Dòng 1-xxx
│
├── Models/                                       # Database Entities (EF Core)
│   ├── User.cs                                  # Dòng 1-45
│   │   └── Users table entity
│   ├── Donation.cs                              # Dòng 1-xxx
│   │   └── Donations table entity
│   ├── NgoProgram.cs                            # Dòng 1-xxx
│   │   └── NgoPrograms table entity
│   ├── NGO.cs                                   # Dòng 1-xxx
│   ├── Partner.cs                               # Dòng 1-xxx
│   ├── Gallery.cs                               # Dòng 1-xxx
│   ├── Query.cs                                 # Dòng 1-xxx
│   ├── ProgramRegistration.cs                   # Dòng 1-xxx
│   ├── Invitation.cs                            # Dòng 1-xxx
│   ├── Cause.cs                                 # Dòng 1-xxx
│   ├── AboutSection.cs                          # Dòng 1-xxx
│   └── UserProfile.cs                           # Dòng 1-xxx
│
├── DTOs/                                         # Data Transfer Objects (API contracts)
│   ├── DonationDTO.cs                           # Dòng 1-xxx
│   │   └── Request/Response cho donation
│   ├── LoginRequest.cs                          # Dòng 1-xxx
│   │   └── Login payload
│   ├── RegisterRequest.cs                       # Dòng 1-xxx
│   │   └── Registration payload
│   └── ... (các DTO khác)
│
├── Data/
│   └── GiveAidContext.cs                        # Dòng 1-54
│       └── EF Core DbContext, entity configuration
│
├── Helpers/                                      # Utility Classes
│   ├── JwtHelper.cs                             # Dòng 1-xxx
│   │   └── JWT token generation & validation
│   ├── PasswordHasher.cs                        # Dòng 1-xxx
│   │   └── BCrypt password hashing
│   ├── EmailTemplate.cs                         # Dòng 1-302
│   │   └── HTML email templates
│   ├── DataSeeder.cs                            # Dòng 1-309
│   │   └── Auto-seed admin user & initial data
│   └── PaymentValidator.cs                      # Dòng 1-xxx
│       └── Luhn algorithm for card validation
│
├── Migrations/                                   # EF Core Database Migrations
│   ├── 20251021161050_InitialCreate.cs
│   │   └── Tạo tất cả tables ban đầu
│   ├── 20251031044158_AddUsernameToUser.cs
│   ├── 20251031092945_AddEmailVerificationToUser.cs
│   ├── 20251101120000_AddPasswordResetToUser.cs
│   ├── 20251103131053_AddProgramRegistration.cs
│   └── 20251105155757_AddProgramGoalAndDonationLink.cs
│
└── Scripts/                                      # SQL Scripts (optional)
    └── README_CREATE_ADMIN.md
```

### 2.2 Top 10 Files Backend Quan Trọng Nhất

**Thứ tự ưu tiên đọc cho dev mới:**

1. **`Program.cs` (Dòng 1-117)**
   - Entry point, DI container setup, middleware pipeline
   - JWT authentication config, CORS config
   - Data seeding on startup

2. **`Controllers/AuthController.cs` (Dòng 1-205)**
   - Tất cả endpoints liên quan authentication
   - Register, login, verify email, password reset

3. **`Services/AuthService.cs` (Dòng 1-527)**
   - Business logic cho authentication
   - Password hashing, token generation, email verification

4. **`Controllers/DonationController.cs` (Dòng 1-130)**
   - Donation endpoints
   - Create donation, get user donations, admin get all

5. **`Services/DonationService.cs` (Dòng 1-190)**
   - Donation processing logic
   - Email confirmation sending

6. **`Data/GiveAidContext.cs` (Dòng 1-54)**
   - EF Core DbContext
   - Entity relationships, constraints

7. **`Helpers/JwtHelper.cs`**
   - JWT token generation & validation
   - Claims mapping

8. **`Helpers/DataSeeder.cs` (Dòng 1-309)**
   - Auto-create admin user
   - Seed NGOs and Programs

9. **`Models/User.cs` (Dòng 1-45)**
   - User entity structure
   - Properties, relationships

10. **`Models/Donation.cs`**
    - Donation entity structure
    - Relationships với User và Program

### 2.3 Frontend Structure (Chi Tiết)

```
FRONTEND/
│
├── index.html                                    # HTML template
├── package.json                                  # Dòng 1-35: Dependencies & scripts
├── vite.config.js                               # Vite configuration
│
└── src/
    ├── main.jsx                                 # Entry point: React app mounting
    │
    ├── App.jsx                                  # Dòng 1-120
    │   └── Routes, providers, global setup
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx                       # Main layout wrapper (Navbar + Footer)
    │   │   ├── Navbar.jsx                       # Dòng 1-146: Navigation bar với auth state
    │   │   └── Footer.jsx                       # Footer component
    │   │
    │   ├── admin/
    │   │   ├── AdminLayout.jsx                  # Admin panel layout
    │   │   └── AdminRoute.jsx                   # Admin route guard (check role)
    │   │
    │   └── ScrollToTop.jsx                      # Scroll restoration on route change
    │
    ├── pages/
    │   ├── HomePage.jsx                         # Landing page
    │   ├── DonatePage.jsx                       # Dòng 1-767
    │   │   └── Donation form + program selection
    │   ├── LoginPage.jsx                        # Dòng 1-xxx
    │   │   └── Login form
    │   ├── RegisterPage.jsx                     # Dòng 1-xxx
    │   │   └── Registration form
    │   ├── DonationHistoryPage.jsx              # Dòng 1-352
    │   │   └── User donation history
    │   ├── ProgramsPage.jsx                     # Dòng 1-xxx
    │   │   └── Programs listing + registration
    │   ├── NGOsPage.jsx                         # Dòng 1-xxx
    │   ├── PartnersPage.jsx                     # Dòng 1-xxx
    │   ├── GalleryPage.jsx                      # Dòng 1-xxx
    │   ├── AboutPage.jsx                        # Dòng 1-xxx
    │   ├── ContactPage.jsx                      # Dòng 1-xxx
    │   ├── HelpPage.jsx                         # Dòng 1-xxx
    │   ├── ProfilePage.jsx                      # Dòng 1-xxx
    │   ├── VerifyEmailPage.jsx                  # Dòng 1-xxx
    │   ├── ForgotPasswordPage.jsx               # Dòng 1-xxx
    │   ├── ResetPasswordPage.jsx                # Dòng 1-xxx
    │   │
    │   └── admin/
    │       ├── UsersPage.jsx                    # Admin: User management
    │       ├── DonationsPage.jsx                # Admin: Donations dashboard
    │       ├── ProgramsPage.jsx                 # Admin: Programs management
    │       ├── NGOsPage.jsx                     # Admin: NGOs management
    │       ├── PartnersPage.jsx                 # Admin: Partners management
    │       ├── GalleryPage.jsx                  # Admin: Gallery management
    │       ├── AboutPage.jsx                    # Admin: About sections management
    │       └── QueriesPage.jsx                  # Admin: Queries management
    │
    ├── services/                                # API Service Layer
    │   ├── api.js                              # Dòng 1-xxx
    │   │   └── Axios instance + JWT interceptor
    │   ├── authServices.js                     # Dòng 1-xxx
    │   │   └── Auth API calls (login, register, verify, etc.)
    │   ├── donationServices.js                 # Dòng 1-xxx
    │   │   └── Donation API calls
    │   ├── programServices.js                  # Dòng 1-xxx
    │   │   └── Program API calls
    │   ├── adminServices.js                    # Dòng 1-xxx
    │   │   └── Admin API calls
    │   ├── ngoServices.js                      # Dòng 1-xxx
    │   ├── partnerServices.js                  # Dòng 1-xxx
    │   ├── galleryServices.js                  # Dòng 1-xxx
    │   ├── contactServices.js                  # Dòng 1-xxx
    │   ├── profileServices.js                  # Dòng 1-xxx
    │   └── queryServices.js                    # Dòng 1-xxx
    │
    ├── contexts/
    │   └── AuthContext.jsx                     # Dòng 1-167
    │       └── Global auth state (user, token, login, logout)
    │
    ├── assets/
    │   └── css/
    │       ├── style.css                       # Dòng 1-1335: Global styles
    │       └── donate.css                      # Dòng 1-384: Donation page styles
    │
    └── utilis/
        ├── helpers.js                          # Utility functions
        └── useCounter.js                       # Counter animation hook
```

### 2.4 Top 10 Files Frontend Quan Trọng Nhất

1. **`main.jsx`**
   - Entry point: React app mounting
   - Import CSS, render App

2. **`App.jsx` (Dòng 1-120)**
   - Routes configuration
   - AuthProvider, ToastContainer
   - AOS initialization

3. **`contexts/AuthContext.jsx` (Dòng 1-167)**
   - Global auth state management
   - JWT token handling, user state

4. **`services/api.js`**
   - Axios instance với JWT interceptor
   - Base URL, error handling

5. **`services/authServices.js`**
   - Login, register, verify email API calls
   - Password reset API calls

6. **`pages/DonatePage.jsx` (Dòng 1-767)**
   - Donation form với program selection
   - Form validation, API call

7. **`pages/LoginPage.jsx`**
   - Login form
   - Integration với AuthContext

8. **`components/layout/Navbar.jsx` (Dòng 1-146)**
   - Navigation với auth state
   - User menu, admin links

9. **`components/admin/AdminRoute.jsx`**
   - Admin route guard
   - Check authentication & role

10. **`services/donationServices.js`**
    - Donation API calls
    - Create donation, get history

---

## 3. Backend Deep Dive

### 3.1 Program.cs - Entry Point & Configuration

**File**: `Backend/Program.cs` **Dòng 1-117**

**Chức năng chính:**

#### A. JSON Serialization Configuration (Dòng 12-20)

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convert C# PascalCase → JSON camelCase
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        
        // Case-insensitive property matching
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        
        // Ignore circular references (prevent infinite loops)
        // VD: Donation.User.Donations.User.Donations...
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
```

**Tại sao cần:**
- Frontend React dùng camelCase (`userName`), Backend C# dùng PascalCase (`UserName`)
- Circular references: Entity có navigation properties → serialize sẽ loop vô tận

#### B. Database Context Registration (Dòng 24-27)

```csharp
var conn = builder.Configuration.GetConnectionString("DefaultConnection")
           ?? "Server=(localdb)\\MSSQLLocalDB;Database=GiveAidDB;Trusted_Connection=True;";

builder.Services.AddDbContext<GiveAidContext>(options => options.UseSqlServer(conn));
```

**Luồng hoạt động:**
1. Đọc connection string từ `appsettings.Development.json` (nếu có)
2. Nếu không có, dùng default LocalDB
3. Đăng ký `GiveAidContext` vào DI container với scope `Scoped` (1 instance per request)

#### C. Dependency Injection - Services (Dòng 29-41)

```csharp
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DonationService>();
builder.Services.AddScoped<ProgramService>();
// ... tất cả services
```

**Lifetime Options:**
- **Scoped**: 1 instance per HTTP request (recommended cho services)
- **Singleton**: 1 instance cho toàn bộ app lifetime
- **Transient**: New instance mỗi lần resolve

**Tại sao dùng Scoped:**
- Mỗi HTTP request có 1 instance service → thread-safe
- DbContext cũng Scoped → service và context cùng scope

#### D. JWT Authentication Configuration (Dòng 43-66)

```csharp
var jwtKey = builder.Configuration["Jwt:Key"] ?? "very_secret_key_change_me_please";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Give_AID";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,              // "Give_AID"
        ValidateAudience = false,             // Không validate audience
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),  // HS256
        ValidateLifetime = true,              // Check token expiry
    };
});
```

**Token Validation Flow:**
1. Request đến với header `Authorization: Bearer {token}`
2. JWT middleware validate:
   - Signature (dùng secret key)
   - Issuer (phải là "Give_AID")
   - Expiry (token chưa hết hạn)
3. Nếu valid → set `HttpContext.User` với claims
4. Controller có thể dùng `User.FindFirst(ClaimTypes.NameIdentifier)` để lấy userId

#### E. CORS Configuration (Dòng 71-80)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // Cho phép gửi cookies/credentials (JWT)
    });
});
```

**Tại sao cần CORS:**
- Frontend chạy `localhost:5173`, Backend chạy `localhost:5230` → khác origin
- Browser block cross-origin requests nếu không có CORS
- `AllowCredentials()` cần để gửi JWT token trong header

#### F. Middleware Pipeline (Dòng 111-115)

```csharp
app.UseHttpsRedirection();      // Redirect HTTP → HTTPS
app.UseCors("AllowFrontend");   // Apply CORS policy
app.UseAuthentication();        // JWT authentication (MUST before Authorization)
app.UseAuthorization();         // Role-based authorization
app.MapControllers();           // Map routes to controllers
```

**Thứ tự quan trọng:**
1. `UseCors()` phải trước `UseAuthentication()`
2. `UseAuthentication()` phải trước `UseAuthorization()`

#### G. Data Seeding (Dòng 84-103)

```csharp
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<GiveAidContext>();
    var configuration = services.GetRequiredService<IConfiguration>();
    
    try
    {
        // Seed admin user (nếu chưa có)
        await DataSeeder.SeedAdminUserAsync(context, configuration);
        
        // Seed NGOs và Programs (nếu database rỗng)
        await DataSeeder.SeedNGOsAndProgramsAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding data: {ex.Message}");
    }
}
```

**Chạy khi nào:**
- Mỗi lần app start (development/production)
- Nếu admin đã tồn tại → skip
- Nếu database có NGOs/Programs → skip

**Check file**: `Backend/Helpers/DataSeeder.cs` (Dòng 1-309)

### 3.2 Controllers → Services → Models Pattern

**Kiến trúc Layered:**

```
HTTP Request
    ↓
Controller (Validation + HTTP handling)
    ↓
Service (Business Logic)
    ↓
DbContext (Data Access)
    ↓
Database (SQL Server)
```

**Ví dụ: Donation Creation Flow**

#### Step 1: Controller nhận request

**File**: `Backend/Controllers/DonationController.cs` **Dòng 22-83**

```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] DonationDTO? dto)
{
    // Dòng 26-29: Null check
    if (dto == null)
    {
        return BadRequest(new { message = "Request body is required" });
    }

    // Dòng 32: Log for debugging
    Console.WriteLine($"[Donation] Received: Amount={dto.Amount}, Cause={dto.Cause}, ...");

    // Dòng 34-44: ModelState validation
    if (!ModelState.IsValid)
    {
        var errors = ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) })
            .ToList();
        
        Console.WriteLine($"[Donation] ModelState validation failed: ...");
        return BadRequest(new { message = "Validation failed", errors });
    }
    
    // Dòng 47-69: Manual validation
    if (dto.Amount <= 0)
        return BadRequest(new { message = "Amount must be greater than 0" });
    if (string.IsNullOrWhiteSpace(dto.Cause))
        return BadRequest(new { message = "Cause is required" });
    // ... more validations

    try
    {
        // Dòng 73: Delegate to service
        var donation = await _donationService.CreateAsync(dto);
        Console.WriteLine($"[Donation] Successfully created donation ID: {donation.Id}");
        return Ok(donation);
    }
    catch (Exception ex)
    {
        // Dòng 79-81: Error handling
        Console.WriteLine($"[Donation] Exception: {ex.Message}");
        return BadRequest(new { message = "Failed to create donation", error = ex.Message });
    }
}
```

**Trách nhiệm Controller:**
- ✅ Validate HTTP request (null check, ModelState)
- ✅ Delegate business logic cho Service
- ✅ Handle HTTP responses (200 OK, 400 BadRequest, 500 InternalServerError)
- ✅ Logging for debugging

#### Step 2: Service xử lý business logic

**File**: `Backend/Services/DonationService.cs` **Dòng 24-135**

```csharp
public async Task<Donation> CreateAsync(DonationDTO dto)
{
    // Dòng 27-50: Business validation
    if (string.IsNullOrWhiteSpace(dto.Email))
        throw new ArgumentException("Email is required");
    if (string.IsNullOrWhiteSpace(dto.FullName))
        throw new ArgumentException("Full name is required");
    if (string.IsNullOrWhiteSpace(dto.Cause))
        throw new ArgumentException("Cause is required");

    // Dòng 43: Prepare donor name (anonymous check)
    var donorName = dto.Anonymous ? "Anonymous" : dto.FullName.Trim();
    var donorEmail = dto.Email.Trim();
    
    // Dòng 52-67: Create donation entity
    var donation = new Donation
    {
        Amount = dto.Amount,
        CauseName = string.IsNullOrWhiteSpace(dto.Cause) ? "General Donation" : dto.Cause.Trim(),
        PaymentStatus = "Success",  // Dummy payment luôn thành công
        PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "Card" : dto.PaymentMethod.Trim(),
        UserId = dto.UserId,        // null nếu guest donate
        ProgramId = dto.ProgramId,  // Link to program if provided
        TransactionReference = "TRX-" + Guid.NewGuid().ToString("N").Substring(0, 12),
        DonorName = donorName,
        DonorEmail = donorEmail,
        DonorPhone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
        DonorAddress = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
        IsAnonymous = dto.Anonymous,
        SubscribeNewsletter = dto.Newsletter
    };

    try
    {
        // Dòng 71-74: Save to database
        Console.WriteLine($"[DonationService] Creating donation: ...");
        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();
        Console.WriteLine($"[DonationService] Donation created successfully with ID: {donation.Id}");

        // Dòng 77-111: Send email confirmation (fire-and-forget)
        if (!string.IsNullOrWhiteSpace(donorEmail) && !dto.Anonymous)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    var emailBody = EmailTemplate.DonationReceiptTemplate(
                        donorName,
                        donation.Amount,
                        donation.CauseName,
                        donation.TransactionReference,
                        donation.CreatedAt
                    );
                    await _emailService.SendEmailAsync(
                        donorEmail,
                        "Thank you for your donation",
                        emailBody
                    );
                    Console.WriteLine($"[DonationService] Confirmation email sent to {donorEmail}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[DonationService] Failed to send email: {ex.Message}");
                    // Fail silently - không block donation success
                }
            });
        }
        
        return donation;
    }
    catch (DbUpdateException dbEx)
    {
        // Dòng 119-128: Database error handling
        Console.WriteLine($"[DonationService] Database error: {dbEx.InnerException?.Message}");
        throw new Exception($"Database error while creating donation: {dbEx.InnerException?.Message}", dbEx);
    }
}
```

**Trách nhiệm Service:**
- ✅ Business logic validation
- ✅ Create entity objects
- ✅ Save to database via DbContext
- ✅ Send emails (fire-and-forget)
- ✅ Error handling với specific exceptions

**Fire-and-Forget Pattern:**
- `_ = Task.Run(async () => { ... })` → không await
- Email gửi background, không block response
- Response time: ~100-200ms (thay vì ~1-2s nếu await email)

#### Step 3: Entity Framework save to database

**File**: `Backend/Models/Donation.cs`

```csharp
public class Donation
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string CauseName { get; set; } = string.Empty;
    // ... other properties
}
```

**EF Core translates to SQL:**
```sql
INSERT INTO Donations 
  (Amount, CauseName, PaymentStatus, TransactionReference, DonorName, DonorEmail, UserId, ProgramId, ...)
VALUES 
  (100.00, 'Education for Children', 'Success', 'TRX-a3f9b2c1d4e5', 'John Doe', 'john@example.com', 10, 5, ...)
```

### 3.3 Tất Cả API Endpoints

| Controller | Route Base | Endpoints | Auth Required | File Lines |
|------------|-----------|-----------|---------------|------------|
| **AuthController** | `/api/auth` | `POST /register`<br>`POST /login`<br>`POST /verify-email`<br>`POST /resend-verification`<br>`POST /forgot-password`<br>`POST /reset-password` | ❌ No | 1-205 |
| **DonationController** | `/api/donation` | `POST /` (create)<br>`GET /my-donations` (user history)<br>`GET /` (admin: all)<br>`GET /{id}` (admin: by id) | Varies | 1-130 |
| **ProgramController** | `/api/program` | `GET /` (all programs)<br>`GET /{id}` (by id)<br>`GET /{id}/stats` (program stats)<br>`POST /{id}/register` (register interest)<br>`POST /` (admin: create)<br>`PUT /{id}` (admin: update)<br>`DELETE /{id}` (admin: delete) | Varies | - |
| **AdminController** | `/api/admin` | `GET /users`<br>`GET /users/{id}`<br>`PUT /users/{id}/role`<br>`DELETE /users/{id}`<br>`GET /donations`<br>`GET /donations/{id}`<br>`GET /queries`<br>`POST /queries/{id}/reply` | ✅ Admin | - |
| **ProfileController** | `/api/profile` | `GET /` (get profile)<br>`PUT /` (update profile)<br>`POST /change-password` | ✅ User | - |
| **NGOController** | `/api/ngo` | `GET /` (all NGOs)<br>`GET /{id}` (by id)<br>`POST /` (admin: create)<br>`PUT /{id}` (admin: update)<br>`DELETE /{id}` (admin: delete) | Varies | - |
| **PartnerController** | `/api/partner` | `GET /` (all partners)<br>`POST /` (admin: create)<br>`PUT /{id}` (admin: update)<br>`DELETE /{id}` (admin: delete) | Varies | - |
| **GalleryController** | `/api/gallery` | `GET /` (all images)<br>`POST /` (admin: upload)<br>`DELETE /{id}` (admin: delete) | Varies | - |
| **QueryController** | `/api/query` | `POST /` (submit query)<br>`GET /` (admin: all)<br>`POST /{id}/reply` (admin: reply) | Varies | - |
| **AboutController** | `/api/about` | `GET /{key}` (get section)<br>`POST /` (admin: create)<br>`PUT /{id}` (admin: update) | Varies | - |
| **InvitationController** | `/api/invitation` | `POST /send` (send invitation) | ✅ User | - |

**Legend:**
- ❌ No: Không cần authentication
- ✅ User: Cần login (bất kỳ user nào)
- ✅ Admin: Cần role "Admin"
- Varies: Tùy endpoint (public hoặc protected)

---

## 4. Frontend Deep Dive

### 4.1 App.jsx - Routes & Providers

**File**: `FRONTEND/src/App.jsx` **Dòng 1-120**

**Chức năng chính:**

#### A. AOS Initialization (Dòng 36-49)

```jsx
useEffect(() => {
  // Initialize AOS (Animate On Scroll) khi component mount
  import('aos').then(AOS => {
    AOS.init({
      duration: 700,
      easing: 'ease-in-out',
      once: true,        // Chỉ animate 1 lần khi scroll đến
      offset: 50         // Offset 50px từ top để trigger animation
    });
  });

  // Import AOS CSS
  import('aos/dist/aos.css');
}, []);
```

**Tại sao dùng dynamic import:**
- Giảm bundle size ban đầu
- AOS chỉ load khi cần (lazy loading)

#### B. Routes Structure (Dòng 52-101)

```jsx
<BrowserRouter>
  <AuthProvider>  {/* Global auth state */}
    <ScrollToTop />  {/* Restore scroll position on route change */}
    
    <Routes>
      {/* Admin Routes - Protected */}
      <Route path="/admin/*" element={
        <AdminRoute>  {/* Guard: check authentication & admin role */}
          <AdminLayout>  {/* Admin sidebar + header */}
            <Routes>
              <Route path="users" element={<UsersPage />} />
              <Route path="donations" element={<DonationsPageAdmin />} />
              <Route path="programs" element={<ProgramsPageAdmin />} />
              <Route path="ngos" element={<NGOsPageAdmin />} />
              <Route path="gallery" element={<GalleryPageAdmin />} />
              <Route path="partners" element={<PartnersPageAdmin />} />
              <Route path="about" element={<AboutPageAdmin />} />
              <Route path="queries" element={<QueriesPage />} />
              <Route path="*" element={<UsersPage />} />  {/* Default */}
            </Routes>
          </AdminLayout>
        </AdminRoute>
      } />
      
      {/* Public Routes */}
      <Route path="/*" element={
        <Layout>  {/* Navbar + Footer wrapper */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* ... more routes */}
          </Routes>
        </Layout>
      } />
    </Routes>
    
    {/* Global Toast Notifications */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </AuthProvider>
</BrowserRouter>
```

**Route Nesting:**
- Admin routes: `/admin/*` → nested routes bên trong `AdminRoute`
- Public routes: `/*` → nested routes bên trong `Layout`

### 4.2 Authentication Context (Global State)

**File**: `FRONTEND/src/contexts/AuthContext.jsx` **Dòng 1-167**

**State Management:**

```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // User object
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  // Decode JWT token để lấy user info
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      // Map JWT claims to user data (hỗ trợ nhiều format claims)
      return {
        id: decoded['nameid'] || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub,
        email: decoded['email'] || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        fullName: decoded['fullName'] || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User'
      };
    } catch (error) {
      return null;
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    // Try localStorage user object first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && userData.email) {
          setUser(userData);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        // Continue to decode token
      }
    }
    
    // If no saved user, decode token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.email) {
        const userData = {
          fullName: decoded.fullName || 'User',
          email: decoded.email,
          id: decoded.id,
          role: decoded.role || 'User'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const result = await loginService(usernameOrEmail, password);
    if (result.success) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.email) {
          const userData = {
            fullName: decoded.fullName || 'User',
            email: decoded.email,
            id: decoded.id,
            role: decoded.role || 'User'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'Admin',
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Functions:**
- `decodeToken(token)` — Decode JWT để lấy user info
- `login(usernameOrEmail, password)` — Login và save token + user
- `logout()` — Clear localStorage và redirect

**State Properties:**
- `user` — User object `{ id, email, fullName, role }`
- `isAuthenticated` — Boolean (`!!user`)
- `isAdmin` — Boolean (`user?.role === 'Admin'`)
- `isLoading` — Boolean (true khi đang init từ localStorage)

### 4.3 API Service Layer (Axios)

**File**: `FRONTEND/src/services/api.js`

```javascript
import axios from 'axios';

// Tạo Axios instance với base URL
const api = axios.create({
  baseURL: 'http://localhost:5230/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Thêm JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors (auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Usage trong Service Files:**

```javascript
// authServices.js
import api from './api';

export const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', { usernameOrEmail, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
```

### 4.4 DonatePage.jsx - Donation Form

**File**: `FRONTEND/src/pages/DonatePage.jsx` **Dòng 1-767**

**Key Sections:**

#### A. State Management (Dòng 9-25)

```jsx
const [programs, setPrograms] = useState([]);  // Danh sách programs
const [programStats, setProgramStats] = useState({});  // Stats cho mỗi program
const [isSubmitting, setIsSubmitting] = useState(false);

const [formData, setFormData] = useState({
  amount: '',
  programId: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: 'credit',
  anonymous: false,
  newsletter: true,
});
```

#### B. Fetch Programs & Stats (Dòng 27-50)

```jsx
useEffect(() => {
  const fetchPrograms = async () => {
    try {
      // Fetch all programs
      const res = await programService.getAll();
      const programsData = Array.isArray(res) ? res : [];
      setPrograms(programsData);
      
      // Fetch stats cho mỗi program (parallel)
      const statsPromises = programsData.map(async (program) => {
        try {
          const stats = await programService.getStats(program.id);
          return { programId: program.id, stats };
        } catch (error) {
          console.error(`Failed to load stats for program ${program.id}:`, error);
          return { programId: program.id, stats: null };
        }
      });
      
      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(({ programId, stats }) => {
        statsMap[programId] = stats;
      });
      setProgramStats(statsMap);
    } catch (error) {
      console.error('Failed to load programs:', error);
      toast.error('Failed to load programs');
    }
  };
  
  fetchPrograms();
}, []);
```

#### C. Form Submit Handler (Dòng 150-250)

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Client-side validation
  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    toast.error('Amount must be greater than 0');
    return;
  }
  
  if (!formData.fullName || !formData.email) {
    toast.error('Full name and email are required');
    return;
  }
  
  // Find selected program
  const selectedProgram = programs.find(p => p.id === parseInt(formData.programId));
  const causeName = selectedProgram ? selectedProgram.title : "General Donation";
  
  // Prepare payload
  const donationData = {
    amount: parseFloat(formData.amount),
    cause: causeName,
    programId: parseInt(formData.programId) || null,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone || null,
    address: formData.address || null,
    paymentMethod: formData.paymentMethod,
    anonymous: formData.anonymous,
    newsletter: formData.newsletter,
    userId: user?.id || null  // null nếu guest
  };
  
  setIsSubmitting(true);
  
  try {
    // Call API
    const result = await donationService.create(donationData);
    
    // Success
    toast.success('Donation successful! Check your email for confirmation.');
    navigate('/donation-history');
  } catch (error) {
    // Error handling
    const message = error.response?.data?.message || 'Donation failed';
    toast.error(message);
    console.error('Donation error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

#### D. Program Selection Cards (Dòng 250-350)

```jsx
{programs.slice(0, 6).map((program, index) => {
  const stats = programStats[program.id];
  const isSelected = formData.programId === program.id.toString();

  return (
    <div
      key={program.id}
      className={`category-card h-100 ${isSelected ? 'selected' : ''}`}
      onClick={() => handleProgramCardClick(program.id)}
    >
      <h5 className="category-title">{program.title}</h5>
      <p className="category-description" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '3em',
        lineHeight: '1.5em'
      }}>
        {program.description || "Supporting meaningful charitable activities."}
      </p>
      
      {/* Progress Bar */}
      {stats && stats.goalAmount && stats.goalAmount > 0 ? (
        <div className="mb-2">
          <div className="progress" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${Math.min(stats.progressPercentage || 0, 100)}%` }}
            />
          </div>
          <small className="text-muted">
            {formatCurrency(stats.totalDonations)} / {formatCurrency(stats.goalAmount)}
          </small>
        </div>
      ) : null}
      
      {/* Registration Count */}
      {stats && stats.registrationCount !== undefined && (
        <small className="text-muted">
          <i className="fas fa-users me-1"></i>
          <strong>{stats.registrationCount || 0}</strong> registered
        </small>
      )}
    </div>
  );
})}
```

### 4.5 Admin Route Guard

**File**: `FRONTEND/src/components/admin/AdminRoute.jsx`

```jsx
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return children;
}
```

**Flow:**
1. Check `isLoading` → show loading
2. Check `isAuthenticated` → redirect to login
3. Check `isAdmin` → show 403 error
4. All passed → render children (admin pages)

---

## 5. Database Schema & Migrations

### 5.1 Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Users     │──────<│  Donations   │>──────│  NgoPrograms │
│             │ 1:N   │              │  N:1  │              │
│ Id (PK)     │       │ Id (PK)      │       │ Id (PK)      │
│ Email       │       │ Amount       │       │ Title        │
│ PasswordHash│       │ CauseName    │       │ Description  │
│ Role        │       │ UserId (FK)  │       │ NGOId (FK)   │
│ EmailVerified│       │ ProgramId(FK)│       │ GoalAmount   │
└─────────────┘       │ DonorName    │       └──────────────┘
       │              │ DonorEmail   │              │
       │              │ PaymentStatus│              │
       │              └──────────────┘              │
       │                                            │
       └────────────<│ProgramReg.   │>─────────────┘
                  1:N │              │ N:1
                      │ Id (PK)      │
                      │ UserId (FK)  │
                      │ ProgramId(FK)│
                      │ Email        │
                      └──────────────┘

┌──────────────┐
│   NGOs       │──────────┐
│              │ 1:N      │
│ Id (PK)      │          │
│ Name         │          ▼
│ Description  │    ┌──────────────┐
│ ContactEmail │    │  NgoPrograms │
└──────────────┘    └──────────────┘
```

### 5.2 Key Tables

#### Users Table

**File**: `Backend/Models/User.cs` **Dòng 1-45**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `Id` | int | PK, IDENTITY(1,1) | Auto-increment |
| `Username` | string(50) | UNIQUE, NOT NULL | Login username |
| `Email` | string(255) | UNIQUE, NOT NULL, INDEX | User email |
| `PasswordHash` | string(255) | NOT NULL | BCrypt hashed password |
| `FullName` | string(100) | NOT NULL | Display name |
| `Phone` | string(50) | NULL | Contact number |
| `Address` | string(500) | NULL | User address |
| `Role` | string(20) | NOT NULL, DEFAULT='User' | 'User' or 'Admin' |
| `EmailVerified` | bit | NOT NULL, DEFAULT=0 | Email confirmation status |
| `EmailVerificationToken` | string(255) | NULL | Hashed verification token |
| `EmailVerificationTokenExpiry` | datetime2 | NULL | Token expiry (24h from creation) |
| `PasswordResetToken` | string(255) | NULL | Hashed reset token |
| `PasswordResetTokenExpiry` | datetime2 | NULL | Token expiry (1h from creation) |
| `CreatedAt` | datetime2 | NOT NULL, DEFAULT(GETUTCDATE()) | Account creation time |

**Indexes:**
- `IX_Users_Email` (UNIQUE)
- `IX_Users_Username` (UNIQUE)

**Migrations:**
- `20251021161050_InitialCreate.cs` — Creates table
- `20251031044158_AddUsernameToUser.cs` — Adds Username column
- `20251031092945_AddEmailVerificationToUser.cs` — Adds email verification
- `20251101120000_AddPasswordResetToUser.cs` — Adds password reset

#### Donations Table

**File**: `Backend/Models/Donation.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `Id` | int | PK, IDENTITY(1,1) | Auto-increment |
| `Amount` | decimal(18,2) | NOT NULL | Donation amount |
| `CauseName` | string(200) | NOT NULL | Program/cause name |
| `PaymentStatus` | string(20) | NOT NULL, DEFAULT='Pending' | 'Success'/'Failed'/'Pending' |
| `PaymentMethod` | string(50) | NULL | 'Credit Card'/'Debit Card'/'Bank Transfer' |
| `UserId` | int | FK→Users.Id, NULL | Donor (if logged in) |
| `ProgramId` | int | FK→NgoPrograms.Id, NULL | Linked program |
| `TransactionReference` | string(50) | UNIQUE, NOT NULL | TRX-xxxxxxxxxxxxx |
| `DonorName` | string(100) | NOT NULL | Donor name (or "Anonymous") |
| `DonorEmail` | string(255) | NOT NULL | Donor email |
| `DonorPhone` | string(50) | NULL | Donor phone |
| `DonorAddress` | string(500) | NULL | Donor address |
| `IsAnonymous` | bit | NOT NULL, DEFAULT=0 | Hide donor name |
| `SubscribeNewsletter` | bit | NOT NULL, DEFAULT=0 | Newsletter opt-in |
| `CreatedAt` | datetime2 | NOT NULL, DEFAULT(GETUTCDATE()) | Donation timestamp |

**Foreign Keys:**
- `FK_Donations_Users_UserId` → `Users.Id` (ON DELETE SET NULL)
- `FK_Donations_NgoPrograms_ProgramId` → `NgoPrograms.Id` (ON DELETE SET NULL)

**Indexes:**
- `IX_Donations_TransactionReference` (UNIQUE)
- `IX_Donations_UserId` (non-unique)
- `IX_Donations_ProgramId` (non-unique)
- `IX_Donations_CreatedAt` (non-unique, for sorting)

**Migrations:**
- `20251021161050_InitialCreate.cs` — Creates table
- `20251105155757_AddProgramGoalAndDonationLink.cs` — Adds ProgramId FK

#### NgoPrograms Table

**File**: `Backend/Models/NgoProgram.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `Id` | int | PK, IDENTITY(1,1) | Auto-increment |
| `Title` | string(200) | NOT NULL | Program name |
| `Description` | nvarchar(MAX) | NULL | Program details (HTML allowed) |
| `Location` | string(200) | NULL | Where program runs |
| `StartDate` | datetime2 | NULL | Program start date |
| `EndDate` | datetime2 | NULL | Program end date |
| `Status` | string(20) | NOT NULL, DEFAULT='Active' | 'Active'/'Completed'/'Cancelled' |
| `NGOId` | int | FK→NGOs.Id, NULL | Owning NGO |
| `GoalAmount` | decimal(18,2) | NULL | Fundraising goal |
| `CreatedAt` | datetime2 | NOT NULL, DEFAULT(GETUTCDATE()) | Creation timestamp |

**Foreign Keys:**
- `FK_NgoPrograms_NGOs_NGOId` → `NGOs.Id` (ON DELETE SET NULL)

**Migrations:**
- `20251021161050_InitialCreate.cs` — Creates table
- `20251105155757_AddProgramGoalAndDonationLink.cs` — Adds GoalAmount

#### ProgramRegistrations Table

**File**: `Backend/Models/ProgramRegistration.cs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `Id` | int | PK, IDENTITY(1,1) | Auto-increment |
| `ProgramId` | int | FK→NgoPrograms.Id, NOT NULL | Program ID |
| `UserId` | int | FK→Users.Id, NULL | User ID (if logged in) |
| `Email` | string(255) | NOT NULL | Registrant email |
| `FullName` | string(100) | NOT NULL | Registrant name |
| `Phone` | string(50) | NULL | Registrant phone |
| `Message` | nvarchar(MAX) | NULL | Additional message |
| `CreatedAt` | datetime2 | NOT NULL, DEFAULT(GETUTCDATE()) | Registration timestamp |

**Foreign Keys:**
- `FK_ProgramRegistrations_NgoPrograms_ProgramId` → `NgoPrograms.Id` (ON DELETE CASCADE)
- `FK_ProgramRegistrations_Users_UserId` → `Users.Id` (ON DELETE SET NULL)

**Unique Constraint:**
- `UQ_ProgramRegistrations_ProgramId_Email` — Prevent duplicate registration (same email + same program)

**Migrations:**
- `20251103131053_AddProgramRegistration.cs` — Creates table

### 5.3 Migrations

**Location**: `Backend/Migrations/`

**How to Create Migration:**
```bash
cd Backend
dotnet ef migrations add MigrationName
```

**How to Apply Migration:**
```bash
dotnet ef database update
```

**How to Rollback:**
```bash
dotnet ef database update PreviousMigrationName
```

**Important Migrations:**

1. **`20251021161050_InitialCreate.cs`**
   - Creates all base tables: Users, Donations, NGOs, NgoPrograms, Partners, Gallery, Queries, Invitations, Causes, AboutSections

2. **`20251031044158_AddUsernameToUser.cs`**
   - Adds `Username` column to Users table
   - Creates unique index on Username

3. **`20251031092945_AddEmailVerificationToUser.cs`**
   - Adds `EmailVerificationToken`, `EmailVerificationTokenExpiry`, `EmailVerified` columns
   - For email verification flow

4. **`20251101120000_AddPasswordResetToUser.cs`**
   - Adds `PasswordResetToken`, `PasswordResetTokenExpiry` columns
   - For password reset flow

5. **`20251103131053_AddProgramRegistration.cs`**
   - Creates `ProgramRegistrations` table
   - Adds unique constraint on (ProgramId, Email)

6. **`20251105155757_AddProgramGoalAndDonationLink.cs`**
   - Adds `GoalAmount` to NgoPrograms
   - Adds `ProgramId` FK to Donations

### 5.4 Data Seeding

**File**: `Backend/Helpers/DataSeeder.cs` **Dòng 1-309**

**Chạy khi nào:**
- Mỗi lần app start (trong `Program.cs` Dòng 84-103)

**Seed Admin User:**
```csharp
public static async Task SeedAdminUserAsync(GiveAidContext context, IConfiguration config)
{
    // Check if admin exists
    var adminExists = await context.Users.AnyAsync(u => u.Email == adminEmail);
    if (adminExists) return;
    
    // Create admin user
    var admin = new User
    {
        Username = adminUsername,
        Email = adminEmail,
        PasswordHash = PasswordHasher.Hash(adminPassword),
        FullName = adminFullName,
        Role = "Admin",
        EmailVerified = true,
        CreatedAt = DateTime.UtcNow
    };
    
    context.Users.Add(admin);
    await context.SaveChangesAsync();
}
```

**Seed NGOs & Programs:**
```csharp
public static async Task SeedNGOsAndProgramsAsync(GiveAidContext context)
{
    // Only seed if database is empty
    if (await context.NGOs.AnyAsync()) return;
    
    // Create NGOs
    var ngo1 = new NGO { Name = "Education Foundation", ... };
    context.NGOs.Add(ngo1);
    
    // Create Programs
    var program1 = new NgoProgram { Title = "Scholarship Program", NGOId = ngo1.Id, ... };
    context.NgoPrograms.Add(program1);
    
    await context.SaveChangesAsync();
}
```

**Default Admin Credentials:**
- Email: `admin@giveaid.org`
- Username: `admin`
- Password: `Admin123!`

---

## 6. Authentication & Authorization Flow

### 6.1 Registration → Email Verification → Login Flow

**Luồng hoàn chỉnh:**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Registration                                    │
└─────────────────────────────────────────────────────────────┘
Frontend: RegisterPage.jsx
  │
  ├─> User điền form (email, username, password, fullName, ...)
  │
  ├─> POST /api/auth/register
  │   Body: { email, username, password, fullName, phone, address }
  │
Backend: AuthController.cs Dòng 24-61
  │
  ├─> AuthController.Register() (Dòng 24)
  │   ├─ Dòng 26-29: Null check
  │   ├─ Dòng 35-44: ModelState validation
  │   └─ Dòng 47: Delegate to service
  │
  ├─> AuthService.RegisterAsync() (Dòng 29)
  │   ├─ Dòng 32-43: Check email/username exists
  │   │   └─> Query: SELECT * FROM Users WHERE Email = ? OR Username = ?
  │   │
  │   ├─ Dòng 46-56: Create user entity
  │   │   ├─ Dòng 51: Hash password → PasswordHasher.Hash(req.Password)
  │   │   │   └─> BCrypt hash với work factor 12
  │   │   │
  │   │   ├─ Dòng 59: Generate verification token
  │   │   │   └─> Random 32-char token
  │   │   │
  │   │   ├─ Dòng 60: Hash token before saving
  │   │   │   └─> PasswordHasher.Hash(verificationToken)
  │   │   │
  │   │   ├─ Dòng 61: Set expiry = UtcNow + 24 hours
  │   │   └─ Dòng 62: EmailVerified = false
  │   │
  │   ├─ Dòng 64-65: Save to database
  │   │   └─> INSERT INTO Users (...)
  │   │
  │   └─ Dòng 74-111: Send verification email (fire-and-forget)
  │       └─> EmailService.SendEmailAsync()
  │           └─> Email body: VerificationEmailTemplate()
  │           └─> Link: http://localhost:5173/verify-email?token=xxx
  │
  └─> Return: { message: "Registration successful! Please check your email..." }

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: User clicks verification link in email              │
└─────────────────────────────────────────────────────────────┘
Frontend: VerifyEmailPage.jsx
  │
  ├─> Extract token from URL: ?token=xxx
  │
  ├─> POST /api/auth/verify-email
  │   Body: { token: "xxx..." }
  │
Backend: AuthController.cs Dòng 100-130
  │
  ├─> AuthController.VerifyEmail() (Dòng 100)
  │   └─> AuthService.VerifyEmailAsync() (Dòng 139)
  │       │
  │       ├─ Dòng 164-193: Find user by hashed token
  │       │   └─> Query: SELECT * FROM Users WHERE EmailVerificationToken IS NOT NULL
  │       │   └─> Loop through users, verify token với BCrypt.Verify()
  │       │   └─> Match found → user = matched user
  │       │
  │       ├─ Dòng 202-204: Check token expiry
  │       │   └─> if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
  │       │       → return (false, "Token expired")
  │       │
  │       ├─ Dòng 211: Set EmailVerified = true
  │       ├─ Dòng 212-213: Clear verification token
  │       └─ Dòng 214: SaveChangesAsync()
  │
  └─> Return: { message: "Email verified successfully!" }
      Frontend: Show success → Redirect to login

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: User Login                                          │
└─────────────────────────────────────────────────────────────┘
Frontend: LoginPage.jsx
  │
  ├─> User nhập usernameOrEmail + password
  │
  ├─> POST /api/auth/login
  │   Body: { usernameOrEmail, password }
  │
Backend: AuthController.cs Dòng 62-98
  │
  ├─> AuthController.Login() (Dòng 62)
  │   └─> AuthService.LoginAsync() (Dòng 292)
  │       │
  │       ├─ Dòng 295: Check if input is email or username
  │       │   └─> isEmail = req.UsernameOrEmail.Contains("@")
  │       │
  │       ├─ Dòng 298-300: Find user
  │       │   └─> if (isEmail)
  │       │       → SELECT * FROM Users WHERE Email = ?
  │       │   └─> else
  │       │       → SELECT * FROM Users WHERE Username = ?
  │       │
  │       ├─ Dòng 302-303: User not found → return error
  │       │
  │       ├─ Dòng 306-308: Verify password
  │       │   └─> PasswordHasher.Verify(req.Password, user.PasswordHash)
  │       │   └─> BCrypt.Verify() → true/false
  │       │
  │       ├─ Dòng 311-312: Check email verified
  │       │   └─> if (!user.EmailVerified) → return error
  │       │
  │       └─ Dòng 315: Generate JWT token
  │           └─> JwtHelper.GenerateToken(user, _config)
  │               ├─ Create claims:
  │               │   - ClaimTypes.NameIdentifier = user.Id
  │               │   - ClaimTypes.Email = user.Email
  │               │   - ClaimTypes.Name = user.FullName
  │               │   - ClaimTypes.Role = user.Role
  │               │
  │               ├─ Sign với secret key (HS256)
  │               └─ Set expiry = UtcNow + 7 days (default)
  │
  └─> Return: { message: "Login successful", token: "eyJhbGci..." }

Frontend: LoginPage.jsx
  │
  ├─> Receive token
  │
  ├─> AuthContext.login(token)
  │   ├─ localStorage.setItem('token', token)
  │   ├─ Decode JWT → extract user info
  │   ├─ setUser({ id, email, fullName, role })
  │   └─ localStorage.setItem('user', JSON.stringify(user))
  │
  └─> Navigate to home/dashboard
```

### 6.2 JWT Token Structure

**Generated by**: `Backend/Helpers/JwtHelper.cs` **Dòng 13-47**

**Token Format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVXNlciIsImlzcyI6IkdpdmVfQUlEIiwiZXhwIjoxNjk5OTk5OTk5fQ.signature
```

**Header (Base64 decoded):**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload (Base64 decoded):**
```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "123",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "user@example.com",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "John Doe",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
  "iss": "Give_AID",
  "exp": 1699999999
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

**Usage trong Backend Controller:**
```csharp
// Lấy user ID từ JWT token
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
{
    return Unauthorized(new { message = "Invalid token" });
}

// Lấy role
var role = User.FindFirst(ClaimTypes.Role)?.Value;
```

### 6.3 Protected Routes (Backend)

**Middleware**: JWT Bearer Authentication (configured in `Program.cs` Dòng 48-66)

**Usage trong Controllers:**

```csharp
// Require any authenticated user
[Authorize]
[HttpGet("my-donations")]
public async Task<IActionResult> GetMyDonations()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    int userId = int.Parse(userIdClaim.Value);
    // ...
}

// Require Admin role
[Authorize(Roles = "Admin")]
[HttpGet("users")]
public async Task<IActionResult> GetAllUsers()
{
    // Only admins can access
    // ...
}
```

**How it works:**
1. Request đến với header `Authorization: Bearer {token}`
2. JWT Bearer middleware validate token:
   - Check signature với secret key
   - Check issuer (phải là "Give_AID")
   - Check expiry (token chưa hết hạn)
3. Nếu valid → set `HttpContext.User` với claims
4. `[Authorize]` attribute check `HttpContext.User.Identity.IsAuthenticated`
5. `[Authorize(Roles = "Admin")]` check role claim

### 6.4 Protected Routes (Frontend)

**Guard Component**: `FRONTEND/src/components/admin/AdminRoute.jsx`

**Flow:**
```
User navigates to /admin/users
  ↓
AdminRoute component mounts
  ↓
Check isLoading → Show loading if true
  ↓
Check isAuthenticated → Redirect to /login if false
  ↓
Check isAdmin → Show 403 if false
  ↓
All passed → Render children (admin pages)
```

**Code:**
```jsx
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div>403 Forbidden</div>;
  
  return children;
}
```

---

## 7. Luồng Xử Lý Các Tính Năng Chính

### 7.1 Donation Creation (Complete Flow với File References)

**Files Involved:**
1. `FRONTEND/src/pages/DonatePage.jsx` (Dòng 1-767)
2. `FRONTEND/src/services/donationServices.js`
3. `Backend/Controllers/DonationController.cs` (Dòng 22-83)
4. `Backend/Services/DonationService.cs` (Dòng 24-135)
5. `Backend/Helpers/EmailTemplate.cs` (Dòng 64-135)
6. `Backend/Services/EmailService.cs`

**Step-by-Step với Line Numbers:**

**1. User Interaction (Frontend)**

**File**: `FRONTEND/src/pages/DonatePage.jsx`

**Dòng 150-250 (handleSubmit function):**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Client-side validation
  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    toast.error('Amount must be greater than 0');
    return;
  }
  
  // Find program title from programId
  const selectedProgram = programs.find(p => p.id === parseInt(formData.programId));
  const causeName = selectedProgram ? selectedProgram.title : "General Donation";
  
  // Prepare payload
  const donationData = {
    amount: parseFloat(formData.amount),
    cause: causeName,
    programId: parseInt(formData.programId) || null,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone || null,
    address: formData.address || null,
    paymentMethod: formData.paymentMethod,
    anonymous: formData.anonymous,
    newsletter: formData.newsletter,
    userId: user?.id || null
  };
  
  setIsSubmitting(true);
  
  try {
    // Call API service
    const result = await donationService.create(donationData);
    
    // Success
    toast.success('Donation successful! Check your email for confirmation.');
    navigate('/donation-history');
  } catch (error) {
    const message = error.response?.data?.message || 'Donation failed';
    toast.error(message);
    console.error('Donation error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

**2. API Call (Frontend Service)**

**File**: `FRONTEND/src/services/donationServices.js`

```javascript
import api from './api';

export const create = async (donationData) => {
  const response = await api.post('/donation', donationData);
  return response.data;
};
```

**3. Request Received (Backend Controller)**

**File**: `Backend/Controllers/DonationController.cs` **Dòng 22-83**

```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] DonationDTO? dto)
{
    // Dòng 26-29: Null check
    if (dto == null)
    {
        return BadRequest(new { message = "Request body is required" });
    }

    // Dòng 32: Log for debugging
    Console.WriteLine($"[Donation] Received: Amount={dto.Amount}, Cause={dto.Cause}, ...");

    // Dòng 34-44: ModelState validation
    if (!ModelState.IsValid)
    {
        var errors = ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) })
            .ToList();
        
        Console.WriteLine($"[Donation] ModelState validation failed: ...");
        return BadRequest(new { message = "Validation failed", errors });
    }
    
    // Dòng 47-69: Manual validation
    if (dto.Amount <= 0)
        return BadRequest(new { message = "Amount must be greater than 0" });
    if (string.IsNullOrWhiteSpace(dto.Cause))
        return BadRequest(new { message = "Cause is required" });
    if (string.IsNullOrWhiteSpace(dto.FullName))
        return BadRequest(new { message = "Full name is required" });
    if (string.IsNullOrWhiteSpace(dto.Email))
        return BadRequest(new { message = "Email is required" });

    try
    {
        // Dòng 73: Delegate to service
        var donation = await _donationService.CreateAsync(dto);
        Console.WriteLine($"[Donation] Successfully created donation ID: {donation.Id}");
        return Ok(donation);
    }
    catch (Exception ex)
    {
        // Dòng 79-81: Error handling
        Console.WriteLine($"[Donation] Exception: {ex.Message}");
        return BadRequest(new { message = "Failed to create donation", error = ex.Message });
    }
}
```

**4. Business Logic (Service Layer)**

**File**: `Backend/Services/DonationService.cs` **Dòng 24-135**

```csharp
public async Task<Donation> CreateAsync(DonationDTO dto)
{
    // Dòng 27-50: Business validation
    if (string.IsNullOrWhiteSpace(dto.Email))
        throw new ArgumentException("Email is required");
    if (string.IsNullOrWhiteSpace(dto.FullName))
        throw new ArgumentException("Full name is required");
    if (string.IsNullOrWhiteSpace(dto.Cause))
        throw new ArgumentException("Cause is required");

    // Dòng 43: Prepare donor name (anonymous check)
    var donorName = dto.Anonymous ? "Anonymous" : dto.FullName.Trim();
    var donorEmail = dto.Email.Trim();
    
    // Dòng 52-67: Create donation entity
    var donation = new Donation
    {
        Amount = dto.Amount,
        CauseName = string.IsNullOrWhiteSpace(dto.Cause) ? "General Donation" : dto.Cause.Trim(),
        PaymentStatus = "Success",  // Dummy payment luôn thành công
        PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "Card" : dto.PaymentMethod.Trim(),
        UserId = dto.UserId,        // null nếu guest donate
        ProgramId = dto.ProgramId,  // Link to program if provided
        TransactionReference = "TRX-" + Guid.NewGuid().ToString("N").Substring(0, 12),
        DonorName = donorName,
        DonorEmail = donorEmail,
        DonorPhone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
        DonorAddress = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
        IsAnonymous = dto.Anonymous,
        SubscribeNewsletter = dto.Newsletter
    };

    try
    {
        // Dòng 71-74: Save to database
        Console.WriteLine($"[DonationService] Creating donation: ...");
        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();
        Console.WriteLine($"[DonationService] Donation created successfully with ID: {donation.Id}");

        // Dòng 77-111: Send email confirmation (fire-and-forget)
        if (!string.IsNullOrWhiteSpace(donorEmail) && !dto.Anonymous)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    // Dòng 85-95: Generate email body
                    var emailBody = EmailTemplate.DonationReceiptTemplate(
                        donorName,
                        donation.Amount,
                        donation.CauseName,
                        donation.TransactionReference,
                        donation.CreatedAt
                    );
                    
                    // Dòng 96-103: Send email
                    await _emailService.SendEmailAsync(
                        donorEmail,
                        "Thank you for your donation",
                        emailBody
                    );
                    Console.WriteLine($"[DonationService] Confirmation email sent to {donorEmail}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[DonationService] Failed to send email: {ex.Message}");
                    // Fail silently - không block donation success
                }
            });
        }
        
        return donation;
    }
    catch (DbUpdateException dbEx)
    {
        // Dòng 119-128: Database error handling
        Console.WriteLine($"[DonationService] Database error: {dbEx.InnerException?.Message}");
        throw new Exception($"Database error while creating donation: {dbEx.InnerException?.Message}", dbEx);
    }
}
```

**5. Database Save (Entity Framework)**

**EF Core translates to SQL:**
```sql
INSERT INTO Donations 
  (Amount, CauseName, PaymentStatus, PaymentMethod, UserId, ProgramId, 
   TransactionReference, DonorName, DonorEmail, DonorPhone, DonorAddress, 
   IsAnonymous, SubscribeNewsletter, CreatedAt)
VALUES 
  (100.00, 'Education for Children', 'Success', 'Credit Card', 10, 5, 
   'TRX-a3f9b2c1d4e5', 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 
   0, 1, GETUTCDATE())
```

**6. Email Sent (Background Task)**

**File**: `Backend/Services/EmailService.cs`

```csharp
public async Task<bool> SendEmailAsync(string to, string subject, string body)
{
    using var smtpClient = new SmtpClient(_smtpHost, _smtpPort)
    {
        EnableSsl = true,
        Credentials = new NetworkCredential(_smtpUser, _smtpPass)
    };
    
    var mailMessage = new MailMessage
    {
        From = new MailAddress(_smtpFrom),
        Subject = subject,
        Body = body,
        IsBodyHtml = true
    };
    mailMessage.To.Add(to);
    
    await smtpClient.SendMailAsync(mailMessage);
    return true;
}
```

**7. Response Returned & UI Update**

**Frontend receives response:**
```json
{
  "id": 42,
  "amount": 100.00,
  "causeName": "Education for Children",
  "paymentStatus": "Success",
  "transactionReference": "TRX-a3f9b2c1d4e5",
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "createdAt": "2024-11-07T10:30:00Z"
}
```

**Frontend shows success toast và navigate:**
```jsx
toast.success('Donation successful! Check your email for confirmation.');
navigate('/donation-history');
```

### 7.2 Program Registration Flow (Prevent Duplicates)

**Files:**
1. `FRONTEND/src/pages/ProgramsPage.jsx`
2. `FRONTEND/src/services/programServices.js`
3. `Backend/Controllers/ProgramController.cs`
4. `Backend/Services/ProgramService.cs` **Dòng 69-105**

**Flow:**

```
User clicks "Register Interest" → Modal opens
  ↓
User fills form: { fullName, email, phone, message }
  ↓
POST /api/program/{programId}/register
  Body: { fullName, email, phone, message }
  ↓
ProgramController.Register(programId, request) (Dòng 98-115)
  ↓
ProgramService.RegisterAsync(programId, request) (Dòng 69-105)
  │
  ├─ Dòng 71-73: Check program exists
  │   └─> SELECT * FROM NgoPrograms WHERE Id = programId
  │
  ├─ Dòng 76-79: Check duplicate registration
  │   └─> SELECT * FROM ProgramRegistrations
  │       WHERE ProgramId = programId 
  │       AND Email.ToLower() = request.Email.ToLower()
  │
  ├─ Dòng 80-82: If duplicate found
  │   └─> return (false, "You have already registered interest in this program")
  │
  ├─ Dòng 85-95: Create new registration
  │   └─> var registration = new ProgramRegistration {
  │         ProgramId = programId,
  │         UserId = request.UserId,  // null if guest
  │         Email = request.Email,
  │         FullName = request.FullName,
  │         Phone = request.Phone,
  │         Message = request.Message
  │       };
  │
  ├─ Dòng 97-98: Save to database
  │   └─> INSERT INTO ProgramRegistrations (...)
  │
  └─ Dòng 100: Return success
      └─> return (true, "Successfully registered interest")
  ↓
Frontend shows toast: "Successfully registered!"
```

**Duplicate Prevention Logic:**
```csharp
// ProgramService.cs Dòng 76-82
var existingRegistration = await _context.ProgramRegistrations
    .FirstOrDefaultAsync(r => 
        r.ProgramId == programId && 
        r.Email != null && 
        r.Email.ToLower() == req.Email.ToLower());

if (existingRegistration != null)
{
    return (false, "You have already registered interest in this program");
}
```

### 7.3 Get Program Statistics Flow

**Files:**
1. `FRONTEND/src/pages/ProgramsPage.jsx` (fetch stats)
2. `FRONTEND/src/services/programServices.js` (getStats API call)
3. `Backend/Controllers/ProgramController.cs` (Dòng 39-61)
4. `Backend/Services/ProgramService.cs` (GetStatsAsync method)

**Flow:**

```
Frontend: ProgramsPage.jsx useEffect()
  ↓
programService.getStats(programId)
  ↓
GET /api/program/{programId}/stats
  ↓
ProgramController.GetProgramStats(programId) (Dòng 39-61)
  ↓
ProgramService.GetStatsAsync(programId)
  │
  ├─ Calculate total donations
  │   └─> SELECT SUM(Amount) FROM Donations WHERE ProgramId = programId AND PaymentStatus = 'Success'
  │
  ├─ Get goal amount
  │   └─> SELECT GoalAmount FROM NgoPrograms WHERE Id = programId
  │
  ├─ Calculate progress percentage
  │   └─> progressPercentage = (totalDonations / goalAmount) * 100
  │
  ├─ Count registrations
  │   └─> SELECT COUNT(*) FROM ProgramRegistrations WHERE ProgramId = programId
  │
  └─ Return stats object
      {
        programId: 5,
        totalDonations: 5000.00,
        goalAmount: 10000.00,
        progressPercentage: 50.0,
        registrationCount: 42
      }
  ↓
Frontend: Update programStats state
  ↓
Render progress bar: width = {progressPercentage}%
```

---

## 8. Email System

### 8.1 Email Service Configuration

**File**: `Backend/appsettings.json` hoặc `appsettings.Development.json`

```json
{
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "User": "your-email@gmail.com",
    "Pass": "your-app-password",
    "From": "your-email@gmail.com"
  }
}
```

**For Gmail:**
1. Enable 2-Factor Authentication on Google account
2. Generate App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use 16-character App Password (không phải regular password)

**For Outlook:**
```json
{
  "Smtp": {
    "Host": "smtp-mail.outlook.com",
    "Port": "587",
    "User": "your-email@outlook.com",
    "Pass": "your-password",
    "From": "your-email@outlook.com"
  }
}
```

### 8.2 Email Templates

**File**: `Backend/Helpers/EmailTemplate.cs` **Dòng 1-302**

**Available Templates:**

1. **DonationReceiptTemplate** (Dòng 64-135)
   - Purpose: Donation confirmation email
   - Parameters: `donorName`, `amount`, `cause`, `transactionRef`, `donationDate`
   - HTML template với styling đẹp

2. **VerificationEmailTemplate** (Dòng 140-188)
   - Purpose: Email verification
   - Parameters: `fullName`, `verificationLink`, `verificationToken`
   - Link: `http://localhost:5173/verify-email?token=xxx`

3. **PasswordResetEmailTemplate** (Dòng 193-244)
   - Purpose: Password reset
   - Parameters: `fullName`, `resetLink`, `resetToken`
   - Link: `http://localhost:5173/reset-password?token=xxx`

4. **ContactConfirmationEmailTemplate** (Dòng 249-300)
   - Purpose: Contact form confirmation
   - Parameters: `fullName`, `subject`, `queryId`

5. **QueryReplyTemplate** (Dòng 40-59)
   - Purpose: Admin replies to user query
   - Parameters: `subject`, `reply`, `recipientName`

6. **InvitationTemplate** (Dòng 11-35)
   - Purpose: User invites friend
   - Parameters: `fromName`, `message`, `inviteToken`

**Example: Donation Receipt Email**

**File**: `Backend/Helpers/EmailTemplate.cs` **Dòng 64-135**

```csharp
public static string DonationReceiptTemplate(
    string? donorName, 
    decimal amount, 
    string? cause, 
    string? transactionRef, 
    DateTime? donationDate)
{
    var sb = new StringBuilder();
    sb.AppendLine("<!DOCTYPE html>");
    sb.AppendLine("<html>");
    sb.AppendLine("<head>");
    sb.AppendLine("    <meta charset='UTF-8'>");
    sb.AppendLine("    <style>");
    // ... CSS styling
    sb.AppendLine("    </style>");
    sb.AppendLine("</head>");
    sb.AppendLine("<body>");
    sb.AppendLine("    <div class='container'>");
    sb.AppendLine("        <div class='header'>");
    sb.AppendLine("            <h1>❤️ Thank You for Your Donation!</h1>");
    sb.AppendLine("        </div>");
    sb.AppendLine("        <div class='content'>");
    sb.AppendLine($"            <p>Dear <strong>{donorName}</strong>,</p>");
    sb.AppendLine("            <div class='thank-you'>Thank you for your generous contribution!</div>");
    sb.AppendLine($"            <div class='amount'>{amount:C}</div>");
    sb.AppendLine($"            <p>Cause: {cause}</p>");
    sb.AppendLine($"            <p>Transaction Reference: {transactionRef}</p>");
    // ... more HTML
    sb.AppendLine("    </div>");
    sb.AppendLine("</body>");
    sb.AppendLine("</html>");
    
    return sb.ToString();
}
```

### 8.3 Email Sending Strategy (Fire-and-Forget)

**Pattern được sử dụng:**
```csharp
// Don't await - returns response immediately
_ = Task.Run(async () =>
{
    try
    {
        await _emailService.SendEmailAsync(...);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email sending failed: {ex.Message}");
        // Fail silently - don't block user flow
    }
});
```

**Benefits:**
- Response time: ~100-200ms (thay vì ~1-2s nếu await email)
- User không phải đợi email gửi xong
- Email failures không block donation success

**Trade-offs:**
- Email có thể fail mà user không biết (nhưng donation vẫn thành công)
- Không có retry mechanism (có thể implement sau)

---

## 9. Hướng Dẫn Debugging

### 9.1 Debugging Failed Donation

**Triệu chứng**: User click "Donate Now" → Error "Donation failed"

**Step 1: Check Frontend Console (F12)**

Mở browser DevTools (F12) → Console tab, tìm errors:

```javascript
// DonatePage.jsx Dòng 1928-1932
catch (error) {
  const message = error.response?.data?.message || 'Donation failed';
  toast.error(message);
  console.error('Donation error:', error);  // ← Check log này
}
```

**Check request payload:**
```javascript
// Thêm log trước khi submit
console.log('Donation data:', donationData);
// Expected: { amount: 100, cause: "Education", fullName: "John", ... }
```

**Step 2: Check Backend Logs (Terminal)**

Trong terminal chạy backend, tìm logs:

```
[Donation] Received: Amount=100, Cause=Education, FullName=John, Email=john@example.com
[Donation] ModelState validation failed: Amount: must be greater than 0
OR
[DonationService] Creating donation: Amount=100, CauseName=Education, ...
[DonationService] Donation created successfully with ID: 42
OR
[DonationService] Database error: Cannot insert NULL into column 'DonorEmail'
```

**Step 3: Check Database (SSMS)**

Mở SQL Server Management Studio:

```sql
-- Check if donation was created
SELECT TOP 10 * FROM Donations ORDER BY CreatedAt DESC;

-- Check last inserted ID
SELECT IDENT_CURRENT('Donations');

-- Check constraints
EXEC sp_helpconstraint 'Donations';

-- Check if program exists
SELECT * FROM NgoPrograms WHERE Id = 5;
```

**Step 4: Common Issues & Solutions**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Amount must be greater than 0" | Client validation failed | Check `formData.amount` value trong console |
| "Cause is required" | Empty cause field | Ensure program selected hoặc có default "General Donation" |
| "Database error: Cannot insert NULL" | Missing required field | Check DTO mapping, ensure DonorEmail không null |
| "Email sending failed" | SMTP config wrong | Check `appsettings.Development.json` SMTP settings |
| "Program not found" | Invalid programId | Check programId exists trong database |

### 9.2 Debugging Login Issues

**Issue**: User không thể login

**Check 1: User exists?**

```sql
-- Open SSMS
SELECT * FROM Users WHERE Email = 'user@example.com' OR Username = 'username';
```

**Check 2: Email verified?**

```sql
-- Nếu EmailVerified = 0, user không thể login
SELECT Email, EmailVerified, EmailVerificationToken FROM Users WHERE Email = 'user@example.com';

-- Temporary fix (set verified manually)
UPDATE Users SET EmailVerified = 1 WHERE Email = 'user@example.com';
```

**Check 3: Password correct?**

```csharp
// Trong AuthService.cs Dòng 306, thêm debug log
var valid = PasswordHasher.Verify(req.Password, user.PasswordHash);
Console.WriteLine($"[AuthService] Password valid: {valid}");  // Debug
```

**Check 4: JWT token valid?**

```javascript
// Frontend console
const token = localStorage.getItem('token');
console.log('Token:', token);

// Decode token tại jwt.io
// Check claims: id, email, role, exp
```

**Common Login Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid username/email or password" | Wrong password hoặc user không tồn tại | Check password, check user exists |
| "Please verify your email" | Email chưa verified | Set EmailVerified = 1 trong DB hoặc verify email |
| "Token expired" | JWT token hết hạn | Login lại để get new token |

### 9.3 Debugging Email Not Sending

**Check SMTP Config:**

```json
// appsettings.Development.json
{
  "Smtp": {
    "Host": "smtp.gmail.com",      // Correct?
    "Port": "587",                 // 587 for TLS, 465 for SSL
    "User": "your-email@gmail.com",
    "Pass": "app-password-16chars",  // App Password, NOT regular password!
    "From": "your-email@gmail.com"
  }
}
```

**Check Backend Logs:**

```
[Info] Verification email sent successfully to user@example.com
OR
[Warning] Failed to send email: Authentication failed
OR
[Error] SMTP connection timeout
```

**Common SMTP Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Authentication failed" | Wrong password | Use Gmail App Password (not regular password) |
| "Connection refused" | Wrong port | Use 587 for TLS, 465 for SSL |
| "Timeout" | Network/firewall | Try different network, check firewall |

**Test SMTP manually:**

```csharp
// Tạo test endpoint trong TestController.cs
[HttpPost("send-email")]
public async Task<IActionResult> TestEmail()
{
    await _emailService.SendEmailAsync("test@example.com", "Test", "This is a test");
    return Ok("Email sent");
}
```

### 9.4 Debugging Database Connection Issues

**Issue**: "Cannot connect to server" hoặc "Login failed"

**Check 1: SQL Server đang chạy?**

- Mở Task Manager → Services → Tìm "SQL Server (MSSQLSERVER)" hoặc "SQL Server (SQLEXPRESS)"
- Nếu không chạy → Start service

**Check 2: Connection string đúng?**

```json
// appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=Give_AID_API_Db;..."
  }
}
```

**Check server name:**
- Mở SSMS → Connect → Server name hiển thị ở đây
- VD: `DESKTOP-ABC123\SQLEXPRESS` hoặc `localhost\SQLEXPRESS`
- Nếu có dấu `\` → dùng `\\` trong JSON

**Check 3: Database exists?**

```sql
-- Check database exists
SELECT name FROM sys.databases WHERE name = 'Give_AID_API_Db';

-- If not exists, create it
CREATE DATABASE Give_AID_API_Db;
```

**Check 4: User có quyền?**

```sql
-- Check user permissions
EXEC sp_helplogins 'your_username';
```

### 9.5 Breakpoint Recommendations

**Backend (Visual Studio / VS Code):**

1. **DonationController.Create** (Dòng 22)
   - Check DTO received
   - Check validation errors

2. **DonationService.CreateAsync** (Dòng 24)
   - Check entity creation
   - Check database save

3. **AuthService.LoginAsync** (Dòng 292)
   - Check user found
   - Check password verification
   - Check token generation

**Frontend (Chrome DevTools):**

1. **DonatePage.jsx handleSubmit** (Dòng 150)
   - Check formData values
   - Check API call payload

2. **donationServices.js create** function
   - Check request config
   - Check response data

3. **AuthContext.jsx login** function
   - Check token received
   - Check user decoded

---

## 10. Best Practices & Onboarding Checklist

### 10.1 Naming Conventions

**Backend (C#):**
- **Classes**: `PascalCase` (`DonationService`, `AuthController`)
- **Methods**: `PascalCase` (`CreateAsync`, `GetAllAsync`)
- **Variables**: `camelCase` (`userId`, `donationService`)
- **Private fields**: `_camelCase` (`_context`, `_donationService`)
- **Constants**: `PascalCase` (`DefaultConnection`)
- **Namespaces**: `PascalCase` (`Backend.Services`, `Backend.Controllers`)

**Frontend (JavaScript/React):**
- **Components**: `PascalCase` (`DonatePage`, `Navbar`)
- **Functions**: `camelCase` (`handleSubmit`, `fetchPrograms`)
- **Variables**: `camelCase` (`formData`, `isSubmitting`)
- **Constants**: `UPPER_SNAKE_CASE` (`API_BASE_URL`)
- **Hooks**: `camelCase` với "use" prefix (`useAuth`, `useState`)
- **Files**: `PascalCase` cho components (`DonatePage.jsx`), `camelCase` cho utilities (`helpers.js`)

### 10.2 Error Handling Pattern

**Backend (C#):**

```csharp
try
{
    // Business logic
    var result = await _service.DoSomething();
    return Ok(result);
}
catch (ArgumentException ex)
{
    // Client error (400)
    Console.WriteLine($"[Service] Validation error: {ex.Message}");
    return BadRequest(new { message = ex.Message });
}
catch (DbUpdateException dbEx)
{
    // Database error (500)
    Console.WriteLine($"[Service] Database error: {dbEx.InnerException?.Message}");
    return StatusCode(500, new { message = "Database error", error = dbEx.Message });
}
catch (Exception ex)
{
    // Unexpected error (500)
    Console.WriteLine($"[Service] Unexpected error: {ex.Message}");
    return StatusCode(500, new { message = "Internal server error" });
}
```

**Frontend (JavaScript):**

```javascript
try {
  const result = await api.post('/endpoint', data);
  toast.success('Success!');
  return result.data;
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  console.error('API error:', error);  // Log for debugging
  throw error;
}
```

### 10.3 Where to Add New Features

**Scenario: Thêm tính năng "Event"**

**Backend:**

1. **Create Model**: `Backend/Models/Event.cs`
   ```csharp
   public class Event
   {
       public int Id { get; set; }
       public string Title { get; set; } = string.Empty;
       // ... other properties
   }
   ```

2. **Add DbSet**: `Backend/Data/GiveAidContext.cs`
   ```csharp
   public DbSet<Event> Events { get; set; }
   ```

3. **Create Migration:**
   ```bash
   cd Backend
   dotnet ef migrations add AddEventTable
   dotnet ef database update
   ```

4. **Create DTO**: `Backend/DTOs/EventDTO.cs`
   ```csharp
   public class EventDTO
   {
       public string Title { get; set; } = string.Empty;
       // ... other properties
   }
   ```

5. **Create Service**: `Backend/Services/EventService.cs`
   ```csharp
   public class EventService
   {
       private readonly GiveAidContext _context;
       // ... methods
   }
   ```

6. **Register Service**: `Backend/Program.cs` Dòng 29-41
   ```csharp
   builder.Services.AddScoped<EventService>();
   ```

7. **Create Controller**: `Backend/Controllers/EventController.cs`
   ```csharp
   [ApiController]
   [Route("api/[controller]")]
   public class EventController : ControllerBase
   {
       private readonly EventService _eventService;
       // ... endpoints
   }
   ```

**Frontend:**

1. **Create Service**: `FRONTEND/src/services/eventServices.js`
   ```javascript
   import api from './api';
   
   export const getAll = async () => {
     const response = await api.get('/event');
     return response.data;
   };
   ```

2. **Create Page**: `FRONTEND/src/pages/EventsPage.jsx`
   ```jsx
   export default function EventsPage() {
     // ... component code
   }
   ```

3. **Add Route**: `FRONTEND/src/App.jsx` Dòng 80-97
   ```jsx
   <Route path="/events" element={<EventsPage />} />
   ```

4. **Add Nav Link**: `FRONTEND/src/components/layout/Navbar.jsx`
   ```jsx
   <li className="nav-item">
     <Link className="nav-link" to="/events">Events</Link>
   </li>
   ```

### 10.4 Code Review Checklist

**Trước khi tạo Pull Request:**

- [ ] Code compiles without errors
- [ ] No console.log statements left (use Console.WriteLine in backend)
- [ ] Error handling implemented
- [ ] Validation added (client-side + server-side)
- [ ] Database migrations tested
- [ ] API endpoints tested (Swagger hoặc Postman)
- [ ] Frontend pages tested (manual testing)
- [ ] No hardcoded values (use config)
- [ ] Comments added for complex logic
- [ ] Follows naming conventions
- [ ] No sensitive data in code (passwords, API keys)

### 10.5 Onboarding Checklist cho Dev Mới

**Prerequisites:**
- [ ] Install Git
- [ ] Install .NET 8.0 SDK
- [ ] Install SQL Server + SSMS
- [ ] Install Node.js 18+
- [ ] Install VS Code hoặc Visual Studio 2022

**Repository Setup:**
- [ ] Clone repository: `git clone <repo-url>`
- [ ] Checkout dev branch: `git checkout dev` (nếu có)
- [ ] Read README.md (user-facing setup)
- [ ] Read README_MEMBER.md (technical docs - file này)

**Backend Setup:**
- [ ] Navigate to `GIVE-AID/Backend`
- [ ] Run `dotnet restore`
- [ ] Copy `appsettings.example.json` → `appsettings.Development.json`
- [ ] Configure SQL Server connection string
- [ ] Configure SMTP settings (optional, for email features)
- [ ] Run migrations: `dotnet ef database update`
- [ ] Verify database created trong SSMS
- [ ] Run backend: `dotnet run`
- [ ] Test Swagger: `http://localhost:5230/swagger`
- [ ] Verify admin user seeded (check console logs)

**Frontend Setup:**
- [ ] Navigate to `GIVE-AID/FRONTEND`
- [ ] Run `npm install`
- [ ] Verify `package-lock.json` created
- [ ] Check `src/services/api.js` có correct base URL
- [ ] Run frontend: `npm run dev`
- [ ] Open browser: `http://localhost:5173`
- [ ] Test login với admin (admin@giveaid.org / Admin123!)
- [ ] Browse pages, check console for errors

**Code Familiarity:**
- [ ] Read `Backend/Program.cs` — Understand DI & middleware
- [ ] Read `FRONTEND/src/App.jsx` — Understand routes & providers
- [ ] Explore `AuthController` + `AuthService` — Understand auth flow
- [ ] Explore `DonationController` + `DonationService` — Understand donation flow
- [ ] Check database tables trong SSMS — Understand schema
- [ ] Read `AuthContext.jsx` — Understand global state
- [ ] Test API endpoints trong Swagger

**Testing:**
- [ ] Register new user via frontend
- [ ] Verify email (nếu SMTP configured, else manually set EmailVerified=1 trong DB)
- [ ] Login với new user
- [ ] Create a donation
- [ ] Check donation trong database
- [ ] Check donation history page
- [ ] Login as admin
- [ ] Access admin panel
- [ ] View users, donations, programs

**Development Workflow:**
- [ ] Create feature branch: `git checkout -b feature/your-feature`
- [ ] Make changes
- [ ] Test locally
- [ ] Run linter: `npm run lint` (frontend)
- [ ] Commit: `git commit -m "feat: your feature description"`
- [ ] Push: `git push origin feature/your-feature`
- [ ] Create Pull Request
- [ ] Request code review

**Debugging Setup:**
- [ ] Install browser DevTools extensions (React DevTools)
- [ ] Configure VS Code debugger cho .NET (launch.json)
- [ ] Enable verbose logging trong `appsettings.Development.json`
- [ ] Learn to use Swagger for API testing
- [ ] Set up Postman collection (optional)

### 10.6 Quick Reference

**Common Commands:**

**Backend:**
```bash
cd GIVE-AID/Backend
dotnet restore              # Restore NuGet packages
dotnet build               # Build project
dotnet run                 # Run backend (port 5230)
dotnet ef migrations add MigrationName   # Create migration
dotnet ef database update  # Apply migrations
dotnet ef database drop    # Drop database (careful!)
```

**Frontend:**
```bash
cd GIVE-AID/FRONTEND
npm install                # Install dependencies
npm run dev               # Run dev server (port 5173)
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Run ESLint
```

**Important URLs:**
- Frontend Dev: http://localhost:5173
- Backend API: http://localhost:5230
- Swagger Docs: http://localhost:5230/swagger
- Admin Panel: http://localhost:5173/admin/users

**Default Credentials:**
- Admin: admin@giveaid.org / Admin123!

**Key Environment Variables:**

**Backend (appsettings.Development.json):**
- `ConnectionStrings:DefaultConnection` — SQL Server connection
- `Jwt:Key` — JWT secret key
- `Smtp:*` — Email configuration

**Frontend:**
- Base URL hardcoded trong `src/services/api.js` (http://localhost:5230/api)

---

## Tổng Kết

Tài liệu này đã bao phủ:
- ✅ Tổng quan kiến trúc hệ thống
- ✅ Cấu trúc thư mục & file quan trọng
- ✅ Backend deep dive (Controllers, Services, Models)
- ✅ Frontend deep dive (Pages, Components, Services)
- ✅ Database schema & migrations
- ✅ Authentication & authorization flow
- ✅ Luồng xử lý các tính năng chính
- ✅ Email system
- ✅ Hướng dẫn debugging
- ✅ Best practices & onboarding checklist

**Lưu ý quan trọng:**
- File này sẽ được update thường xuyên khi có thay đổi
- Nếu có thắc mắc, hỏi team lead hoặc xem code comments
- Luôn test code trước khi commit
- Follow naming conventions và error handling patterns

---

**Last Updated**: Tháng 11/2024  
**Version**: 1.0.0  
**Maintained by**: Give-AID Development Team
