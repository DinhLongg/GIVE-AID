-- ============================================
-- Script to create default Admin user manually
-- ============================================
-- Default credentials:
-- Email: admin@giveaid.com
-- Password: Admin@123
-- Username: admin
--
-- IMPORTANT: Make sure to change the password after first login!
-- 
-- NOTE: This script is for manual use only. The application will automatically
-- create the admin user on startup if no admin exists.
-- ============================================

USE Give_AID_API_Db;
GO

-- Check if admin user already exists
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@giveaid.com' OR Username = 'admin')
BEGIN
    -- Note: You need to generate BCrypt hash for password 'Admin@123'
    -- You can use the C# PasswordHasher.Hash() method or an online BCrypt generator
    -- Example hash for 'Admin@123': $2a$11$K7L7aNQY6z7zQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q
    
    -- Insert default admin user
    -- REPLACE THE HASH BELOW WITH ACTUAL BCrypt HASH FOR 'Admin@123'
    INSERT INTO Users (FullName, Username, Email, PasswordHash, Role, EmailVerified, CreatedAt)
    VALUES (
        'Administrator',
        'admin',
        'admin@giveaid.com',
        '$2a$11$K7L7aNQY6z7zQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q', -- REPLACE THIS WITH ACTUAL HASH
        'Admin',
        1, -- Email verified by default for admin
        GETUTCDATE()
    );
    
    PRINT 'Admin user created successfully!';
    PRINT 'Email: admin@giveaid.com';
    PRINT 'Password: Admin@123';
    PRINT 'Username: admin';
    PRINT 'Please change the password after first login!';
END
ELSE
BEGIN
    PRINT 'Admin user already exists!';
END
GO

-- ============================================
-- Alternative: Update existing user to Admin
-- ============================================
-- If you already have a user account, you can promote it to Admin:
-- UPDATE Users SET Role = 'Admin' WHERE Email = 'your-email@example.com';
-- GO

