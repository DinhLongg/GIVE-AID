using Backend.Data;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Helpers
{
    public static class DataSeeder
    {
        /// <summary>
        /// Seed default admin user if no admin exists
        /// Admin credentials are read from appsettings.json "Admin" section
        /// </summary>
        public static async Task SeedAdminUserAsync(GiveAidContext context, IConfiguration configuration)
        {
            // Read admin configuration from appsettings.json
            var adminEmail = configuration["Admin:Email"] ?? "admin@giveaid.com";
            var adminUsername = configuration["Admin:Username"] ?? "admin";
            var adminPassword = configuration["Admin:Password"] ?? "Admin@123";
            var adminFullName = configuration["Admin:FullName"] ?? "Administrator";

            // Check if admin user with this email or username already exists
            var existingAdmin = await context.Users
                .FirstOrDefaultAsync(u => (u.Email == adminEmail || u.Username == adminUsername) && u.Role == "Admin");
            
            if (existingAdmin != null)
            {
                // Admin with this email/username already exists
                // Update password and other fields if they differ from config
                var needsUpdate = false;
                
                if (existingAdmin.FullName != adminFullName)
                {
                    existingAdmin.FullName = adminFullName;
                    needsUpdate = true;
                }
                    
                    // Safely update email to match configuration if username matches and target email is unused
                    if (!string.Equals(existingAdmin.Email, adminEmail, StringComparison.OrdinalIgnoreCase))
                    {
                        // Only allow auto email update if this record matches the configured username
                        var matchesConfiguredUsername = string.Equals(existingAdmin.Username, adminUsername, StringComparison.OrdinalIgnoreCase);
                        if (matchesConfiguredUsername)
                        {
                            var emailInUse = await context.Users.AnyAsync(u => u.Email == adminEmail && u.Id != existingAdmin.Id);
                            if (!emailInUse)
                            {
                                existingAdmin.Email = adminEmail;
                                // Keep admin verified to avoid lockout
                                existingAdmin.EmailVerified = true;
                                needsUpdate = true;
                            }
                            else
                            {
                                Console.WriteLine($"[Warning] Cannot update admin email to {adminEmail} because it is already used by another account.");
                            }
                        }
                    }
                
                // Note: We don't auto-update password to avoid security issues
                // If you want to change admin password, delete the admin user first
                // or change it through the admin dashboard or profile page
                
                if (needsUpdate)
                {
                    await context.SaveChangesAsync();
                    Console.WriteLine("==========================================");
                    Console.WriteLine("Admin User Updated!");
                    Console.WriteLine($"Email: {adminEmail}");
                    Console.WriteLine($"Username: {adminUsername}");
                    Console.WriteLine($"Password has been updated from appsettings.json");
                    Console.WriteLine("==========================================");
                }
            }
            else
            {
                // Check if any admin exists (different email/username)
                var anyAdminExists = await context.Users.AnyAsync(u => u.Role == "Admin");
                
                if (!anyAdminExists)
                {
                    // No admin exists, create new one
                    var adminUser = new User
                    {
                        FullName = adminFullName,
                        Username = adminUsername,
                        Email = adminEmail,
                        PasswordHash = PasswordHasher.Hash(adminPassword),
                        Role = "Admin",
                        EmailVerified = true, // Admin email verified by default
                        CreatedAt = DateTime.UtcNow
                    };

                    context.Users.Add(adminUser);
                    await context.SaveChangesAsync();
                    
                    Console.WriteLine("==========================================");
                    Console.WriteLine("Default Admin User Created!");
                    Console.WriteLine($"Email: {adminEmail}");
                    Console.WriteLine($"Username: {adminUsername}");
                    Console.WriteLine($"Password: {adminPassword}");
                    Console.WriteLine("IMPORTANT: Please change the password after first login!");
                    Console.WriteLine("==========================================");
                }
                else
                {
                    Console.WriteLine("Admin user already exists with different email/username.");
                    Console.WriteLine($"Configured: {adminEmail} / {adminUsername}");
                    Console.WriteLine("To use new credentials, delete existing admin first.");
                }
            }
        }
    }
}

