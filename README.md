# Give-AID - NGO Website Platform

<div align="center">

![Give-AID Logo](https://img.shields.io/badge/Give--AID-NGO%20Platform-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)

**A modern, full-stack web platform connecting donors with trusted NGOs for transparent charitable giving.**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Accounts](#user-accounts)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 About the Project

**Give-AID** is a comprehensive Non-Governmental Organization (NGO) platform that bridges the gap between compassionate donors and trusted charitable organizations. The platform provides a transparent, secure, and user-friendly environment for managing donations, programs, and community engagement.

### Key Objectives

- **Connect**: Bridge donors with verified NGOs
- **Transparency**: Track donation usage with detailed reports
- **Efficiency**: Streamline donation processes
- **Impact**: Maximize positive community impact

---

## ✨ Features

### 👥 User Module

- ✅ **User Registration & Authentication**
  - Email verification
  - Password reset functionality
  - Profile management
  
- ✅ **Donation Management**
  - Donate to specific programs or general causes
  - Multiple payment methods (Credit/Debit cards with validation)
  - Email confirmation receipts
  - Personal donation history tracking
  
- ✅ **Program Engagement**
  - View available programs
  - Register interest in programs
  - Track program goals and progress
  - View program statistics
  
- ✅ **Communication**
  - Submit queries/questions
  - Contact form
  - Help center

### 👨‍💼 Admin Module

- ✅ **User Management**
  - View all registered users
  - Update user roles
  - Delete users
  
- ✅ **Donation Management**
  - View all donations
  - Track donation statistics
  - Monitor payment statuses
  
- ✅ **NGO Management**
  - Add/Edit/Delete NGOs
  - Manage NGO information
  
- ✅ **Program Management**
  - Create and manage programs
  - Set program goals
  - Track program progress
  - View registrations
  
- ✅ **Content Management**
  - Manage About Us sections
  - Update Partners information
  - Gallery management
  - Reply to user queries

### 🔒 Security Features

- JWT-based authentication
- Password hashing with secure algorithms
- Email verification
- Protected API endpoints
- Role-based access control

### 💳 Payment Features

- Card validation using Luhn algorithm
- Support for Visa, MasterCard, American Express
- Secure payment processing simulation
- Transaction tracking

---

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQL Server
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT Bearer Tokens
- **Email**: SMTP (configurable)

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Routing**: React Router DOM 7.0
- **HTTP Client**: Axios 1.7
- **UI Framework**: Bootstrap 5
- **Animations**: AOS (Animate On Scroll) 3.0
- **Notifications**: React Toastify 11.0, SweetAlert2 11.15

### Development Tools
- **IDE**: Visual Studio 2022 / VS Code
- **Version Control**: Git
- **API Testing**: Swagger/OpenAPI

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your computer:

### Required Software

1. **Git** (for cloning the repository)
   - Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Verify installation: Open terminal/command prompt and type `git --version`

2. **.NET 8.0 SDK** (for backend)
   - Download: [https://dotnet.microsoft.com/download/dotnet/8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
   - Verify installation: Type `dotnet --version` in terminal

3. **SQL Server** (for database)
   - Option A: SQL Server Express (Free): [https://www.microsoft.com/en-us/sql-server/sql-server-downloads](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - Option B: SQL Server Developer Edition (Free for development)
   - Also install **SQL Server Management Studio (SSMS)**: [Download SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
   - Verify: Open SSMS and connect to your local server

4. **Node.js** (version 18 or higher) (for frontend)
   - Download: [https://nodejs.org/](https://nodejs.org/) (Choose LTS version)
   - Verify installation: Type `node --version` and `npm --version`

5. **Code Editor**
   - Visual Studio 2022 (for backend): [Download](https://visualstudio.microsoft.com/downloads/)
   - OR VS Code (for both): [Download](https://code.visualstudio.com/)

### Optional but Recommended

- **Postman** (for API testing): [Download](https://www.postman.com/downloads/)
- **Git GUI Client** (e.g., GitHub Desktop): [Download](https://desktop.github.com/)

---

## 🚀 Installation

Follow these steps carefully to set up the project on your local machine.

### 1. Clone the Repository

Open your terminal/command prompt and run:

```bash
# Clone the repository
git clone https://github.com/your-username/give-aid.git

# Navigate to the project folder
cd give-aid/GIVE-AID
```

**Alternative**: If you downloaded the project as a ZIP file, extract it and open the `GIVE-AID` folder.

---

### 2. Backend Setup

#### Step 2.1: Navigate to Backend Folder

```bash
cd Backend
```

#### Step 2.2: Restore NuGet Packages

This downloads all required libraries for the backend:

```bash
dotnet restore
```

Wait for the process to complete. You should see "Restore completed" message.

#### Step 2.3: Configure Database Connection

**Option A: Using Windows Authentication (Recommended for beginners)**

1. Open SQL Server Management Studio (SSMS)
2. Connect using Windows Authentication
3. Note your server name (e.g., `DESKTOP-ABC123\SQLEXPRESS` or `localhost\SQLEXPRESS`)

**Option B: Using SQL Server Authentication**

1. Open SSMS
2. Connect using Windows Authentication first
3. Create a new SQL login with password

**Configure the connection string:**

1. Copy the example configuration file:
   - Find file: `appsettings.example.json`
   - Copy it and rename to: `appsettings.Development.json`

2. Open `appsettings.Development.json` in a text editor

3. Update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=Give_AID_API_Db;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  }
}
```

**Replace `YOUR_SERVER_NAME`** with your SQL Server name (from SSMS).

**Example with Windows Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-ABC123\\SQLEXPRESS;Database=Give_AID_API_Db;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  }
}
```

**Example with SQL Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=Give_AID_API_Db;User Id=sa;Password=YourPassword123;Encrypt=False;TrustServerCertifecture=True;MultipleActiveResultSets=true;Connection Timeout=60;"
  }
}
```

⚠️ **Important Note**: If your server name contains a backslash `\`, you must use double backslashes `\\` in JSON files.

#### Step 2.4: Configure Email Settings (Optional)

For email functionality (password reset, donation receipts), add SMTP settings to `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "..."
  },
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
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated 16-character password in the "Pass" field

#### Step 2.5: Create Database

Run the following command to create the database and tables:

```bash
dotnet ef database update
```

✅ You should see messages indicating migrations are being applied.

If you see an error, check:
- SQL Server is running (check Task Manager or Services)
- Connection string is correct
- You have permissions to create databases

#### Step 2.6: Verify Backend Build

Test if the backend compiles successfully:

```bash
dotnet build
```

✅ You should see "Build succeeded" with 0 errors.

---

### 3. Frontend Setup

#### Step 3.1: Navigate to Frontend Folder

From the GIVE-AID root folder:

```bash
cd ../FRONTEND
```

Or if you're in the Backend folder:

```bash
cd ../FRONTEND
```

#### Step 3.2: Install Dependencies

This downloads all required libraries for the frontend:

```bash
npm install
```

Wait for the installation to complete. This may take 2-5 minutes.

If you encounter errors:
- Try running `npm cache clean --force` then `npm install` again
- Ensure you have Node.js 18 or higher installed

#### Step 3.3: Configure API Base URL (Optional)

The frontend is pre-configured to connect to `http://localhost:5230/api`.

If your backend runs on a different port, update `FRONTEND/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5230/api'; // Change port if needed
```

#### Step 3.4: Verify Frontend Build

Test if the frontend compiles:

```bash
npm run build
```

✅ You should see "build completed" message.

---

## ⚙️ Configuration

### Backend Configuration Files

#### `appsettings.json` (Default/Shared Settings)
Contains default settings used by all team members. **Do not put sensitive data here.**

#### `appsettings.Development.json` (Personal Settings)
Contains your personal settings (database credentials, email, etc.). **Not tracked by Git.**

### Frontend Configuration

#### `.env` (If needed)
Create a `.env` file in the `FRONTEND` folder for environment variables:

```env
VITE_API_BASE_URL=http://localhost:5230/api
```

---

## 🎮 Running the Application

### Option 1: Run Backend and Frontend Separately (Recommended for Development)

#### Terminal 1 - Run Backend:

```bash
# Navigate to Backend folder
cd GIVE-AID/Backend

# Run the backend server
dotnet run
```

✅ Backend should start at: `http://localhost:5230`

You'll see:
```
Now listening on: http://localhost:5230
```

Keep this terminal running.

#### Terminal 2 - Run Frontend:

Open a **new terminal window/tab**:

```bash
# Navigate to Frontend folder
cd GIVE-AID/FRONTEND

# Run the development server
npm run dev
```

✅ Frontend should start at: `http://localhost:5173`

You'll see:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Keep this terminal running.

### Option 2: Run Using Visual Studio

1. Open `GIVE-AID/Backend.sln` in Visual Studio 2022
2. Press `F5` or click "Start Debugging"
3. Backend will start automatically
4. In a separate terminal, run frontend: `npm run dev`

### Access the Application

**Frontend (User Interface):**
- URL: [http://localhost:5173](http://localhost:5173)
- Main website for users

**Backend (API):**
- URL: [http://localhost:5230](http://localhost:5230)
- Swagger Documentation: [http://localhost:5230/swagger](http://localhost:5230/swagger)

---

## 📁 Project Structure

```
GIVE-AID/
│
├── Backend/                          # ASP.NET Core Web API
│   ├── Controllers/                  # API endpoints
│   │   ├── AuthController.cs         # Authentication (login, register)
│   │   ├── DonationController.cs     # Donation management
│   │   ├── ProgramController.cs      # Program management
│   │   ├── AdminController.cs        # Admin operations
│   │   └── ...
│   ├── Services/                     # Business logic
│   │   ├── AuthService.cs
│   │   ├── DonationService.cs
│   │   ├── EmailService.cs
│   │   └── ...
│   ├── Models/                       # Database models
│   │   ├── User.cs
│   │   ├── Donation.cs
│   │   ├── NgoProgram.cs
│   │   └── ...
│   ├── Data/                         # Database context
│   │   └── GiveAidContext.cs
│   ├── DTOs/                         # Data Transfer Objects
│   ├── Helpers/                      # Utility classes
│   │   ├── JwtHelper.cs              # JWT token generation
│   │   ├── EmailTemplate.cs          # Email templates
│   │   ├── DataSeeder.cs             # Seed initial data
│   │   └── ...
│   ├── Migrations/                   # Database migrations
│   ├── appsettings.json              # Default configuration
│   ├── appsettings.example.json      # Configuration template
│   ├── Program.cs                    # Application entry point
│   └── README_SETUP.md               # Backend setup guide
│
├── FRONTEND/                         # React Application
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── admin/                # Admin components
│   │   │       ├── AdminLayout.jsx
│   │   │       └── AdminRoute.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── DonatePage.jsx
│   │   │   ├── ProgramsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── DonationHistoryPage.jsx
│   │   │   └── admin/                # Admin pages
│   │   │       ├── UsersPage.jsx
│   │   │       ├── DonationsPage.jsx
│   │   │       ├── ProgramsPage.jsx
│   │   │       └── ...
│   │   ├── services/                 # API service layer
│   │   │   ├── api.js                # Axios configuration
│   │   │   ├── authServices.js
│   │   │   ├── donationServices.js
│   │   │   └── ...
│   │   ├── contexts/                 # React contexts
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── assets/                   # Static assets
│   │   │   └── css/
│   │   │       ├── style.css
│   │   │       └── donate.css
│   │   ├── App.jsx                   # Main App component
│   │   └── main.jsx                  # Application entry point
│   ├── public/                       # Public assets
│   ├── package.json                  # Dependencies
│   ├── vite.config.js               # Vite configuration
│   └── README.md                     # Frontend documentation
│
├── .gitignore                        # Git ignore rules
├── Backend.sln                       # Visual Studio solution
└── README.md                         # This file
```

---

## 👤 User Accounts

### Default Admin Account

After running database migrations, a default admin account is automatically created:

```
Email:    admin@giveaid.org
Username: admin
Password: Admin123!
```

⚠️ **Security Warning**: Change the admin password immediately after first login!

### Creating New Users

**Method 1: Through the Website**
1. Navigate to: [http://localhost:5173/register](http://localhost:5173/register)
2. Fill in the registration form
3. Verify your email (check console logs if email is not configured)
4. Login at: [http://localhost:5173/login](http://localhost:5173/login)

**Method 2: Using Swagger API**
1. Navigate to: [http://localhost:5230/swagger](http://localhost:5230/swagger)
2. Use `POST /api/auth/register` endpoint
3. Provide user details in JSON format

### User Roles

- **User**: Standard user (can donate, register for programs, submit queries)
- **Admin**: Full access to admin panel and all management features

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123!",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",
  "password": "Password123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "User"
  }
}
```

### Donation Endpoints

#### Create Donation
```http
POST /api/donation
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100.00,
  "cause": "Education Program",
  "programId": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "paymentMethod": "Credit Card",
  "anonymous": false,
  "newsletter": true
}
```

#### Get User Donations
```http
GET /api/donation/my-donations
Authorization: Bearer {token}
```

### Program Endpoints

#### Get All Programs
```http
GET /api/program
```

#### Register Interest in Program
```http
POST /api/program/{programId}/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in volunteering"
}
```

### Admin Endpoints (Requires Admin Role)

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {admin-token}
```

#### Get All Donations
```http
GET /api/admin/donations
Authorization: Bearer {admin-token}
```

For complete API documentation, visit Swagger at: [http://localhost:5230/swagger](http://localhost:5230/swagger)

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Won't Start

**Error**: "Unable to connect to database"
- **Solution**: 
  - Check SQL Server is running (open Task Manager → Services → SQL Server)
  - Verify connection string in `appsettings.Development.json`
  - Test connection using SQL Server Management Studio

**Error**: "Port 5230 already in use"
- **Solution**: 
  - Another application is using this port
  - Stop other applications or change port in `Properties/launchSettings.json`

#### 2. Database Migration Issues

**Error**: "A connection was successfully established, but an error occurred during login"
- **Solution**: 
  - Check username and password in connection string
  - Ensure SQL Server Authentication is enabled
  - Try using Windows Authentication (Integrated Security=True)

**Error**: "Cannot open database requested by the login"
- **Solution**: 
  - Database doesn't exist yet
  - Run: `dotnet ef database update`

#### 3. Frontend Issues

**Error**: "npm install fails"
- **Solution**: 
  - Delete `node_modules` folder and `package-lock.json`
  - Run `npm cache clean --force`
  - Run `npm install` again

**Error**: "Network Error" when calling API
- **Solution**: 
  - Ensure backend is running on port 5230
  - Check `FRONTEND/src/services/api.js` has correct base URL
  - Check browser console for CORS errors

#### 4. Email Not Sending

**Error**: Emails not being sent
- **Solution**: 
  - SMTP settings not configured (emails will fail silently)
  - Check `appsettings.Development.json` has correct SMTP settings
  - For Gmail: ensure App Password is used, not regular password
  - Check console logs for email errors

#### 5. Login Issues

**Error**: "Invalid credentials"
- **Solution**: 
  - Verify email is confirmed (check Users table in database)
  - Password is case-sensitive
  - Try password reset feature

**Error**: "Email not verified"
- **Solution**: 
  - Check email for verification link
  - If email not configured, manually set `IsEmailVerified=1` in database

#### 6. Admin Panel Access

**Error**: "403 Forbidden" when accessing admin routes
- **Solution**: 
  - User must have "Admin" role
  - Check User role in database
  - Use default admin account (admin@giveaid.org)

### Getting More Help

- Check console logs in browser (F12 → Console)
- Check backend logs in terminal
- Check `Backend/Logs` folder for detailed logs
- Review `Backend/README_SETUP.md` for backend-specific setup

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
7. **Open a Pull Request**

### Code Standards

- **Backend**: Follow C# coding conventions
- **Frontend**: Follow React best practices
- Add comments for complex logic
- Write meaningful commit messages
- Test before submitting

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Translations
- ♿ Accessibility improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Project Team**: Give-AID Development Team

**Email**: support@giveaid.org

**Project Link**: [https://github.com/your-username/give-aid](https://github.com/your-username/give-aid)

---

## 🙏 Acknowledgments

- **Bootstrap** - UI Framework
- **React** - Frontend Framework
- **ASP.NET Core** - Backend Framework
- **Entity Framework Core** - ORM
- **Font Awesome** - Icons
- **AOS** - Scroll Animations
- All our contributors and supporters

---

## 📈 Project Status

**Current Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 2024

### Feature Completion

- [x] User Authentication & Authorization
- [x] Donation Management
- [x] Program Management
- [x] Admin Dashboard
- [x] Email Notifications
- [x] Payment Validation
- [x] Responsive Design
- [x] API Documentation
- [ ] Invitation Email Feature (Planned)
- [ ] Automated Testing (Planned)
- [ ] CI/CD Pipeline (Planned)

---

<div align="center">

**Made with ❤️ by the Give-AID Team**

⭐ **Star us on GitHub — it helps!**

[Report Bug](https://github.com/your-username/give-aid/issues) • [Request Feature](https://github.com/your-username/give-aid/issues)

</div>

