-- Script to delete existing admin user
-- Use this if you want to recreate admin with new credentials from appsettings.json

USE Give_AID_API_Db;
GO

-- Delete admin user by email
DELETE FROM Users WHERE Email = 'admin@giveaid.com' AND Role = 'Admin';
GO

-- Or delete admin user by username
-- DELETE FROM Users WHERE Username = 'admin' AND Role = 'Admin';
-- GO

-- Or delete ALL admin users (be careful!)
-- DELETE FROM Users WHERE Role = 'Admin';
-- GO

PRINT 'Admin user deleted. Restart the application to create admin with new credentials from appsettings.json';
GO

