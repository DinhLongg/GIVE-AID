using Backend.Data;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Collections.Generic;

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

        /// <summary>
        /// Seed sample NGOs and Programs if database is empty
        /// This ensures new developers have sample data to work with
        /// </summary>
        public static async Task SeedNGOsAndProgramsAsync(GiveAidContext context)
        {
            // Only seed if no NGOs exist
            if (await context.NGOs.AnyAsync())
            {
                Console.WriteLine("[DataSeeder] NGOs already exist. Skipping seed.");
                return;
            }

            Console.WriteLine("[DataSeeder] Seeding NGOs and Programs...");

            // Create NGOs
            var ngoEducation = new NGO
            {
                Name = "Education for All Foundation",
                Description = "A non-profit organization dedicated to providing quality education to underprivileged children worldwide. We believe every child deserves access to education regardless of their background.",
                LogoUrl = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200",
                Website = "https://www.educationforall.org",
                CreatedAt = DateTime.UtcNow
            };

            var ngoHealth = new NGO
            {
                Name = "Global Health Initiative",
                Description = "Committed to improving healthcare access in underserved communities. We provide free medical services, vaccinations, and health education programs.",
                LogoUrl = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200",
                Website = "https://www.globalhealth.org",
                CreatedAt = DateTime.UtcNow
            };

            var ngoWomen = new NGO
            {
                Name = "Women Empowerment Network",
                Description = "Empowering women through education, skills training, and microfinance programs. We help women start businesses and achieve financial independence.",
                LogoUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200",
                Website = "https://www.womenempower.org",
                CreatedAt = DateTime.UtcNow
            };

            var ngoChildren = new NGO
            {
                Name = "Children Support Alliance",
                Description = "Protecting and supporting vulnerable children. We provide shelter, food, education, and emotional support to children in crisis situations.",
                LogoUrl = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200",
                Website = "https://www.childrensupport.org",
                CreatedAt = DateTime.UtcNow
            };

            var ngoEnvironment = new NGO
            {
                Name = "Environmental Action Group",
                Description = "Protecting our planet through conservation, reforestation, and environmental education. We work with communities to create sustainable solutions.",
                LogoUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200",
                Website = "https://www.environmentalaction.org",
                CreatedAt = DateTime.UtcNow
            };

            context.NGOs.AddRange(ngoEducation, ngoHealth, ngoWomen, ngoChildren, ngoEnvironment);
            await context.SaveChangesAsync();

            Console.WriteLine("[DataSeeder] Created 5 NGOs");

            // Create Programs
            var programs = new List<NgoProgram>
            {
                // Education Programs
                new NgoProgram
                {
                    Title = "School Supplies for 1000 Children",
                    Description = "Providing essential school supplies including books, notebooks, pens, and backpacks to 1000 underprivileged children in rural areas. This program ensures children have the tools they need to succeed in school.",
                    StartDate = DateTime.UtcNow.AddMonths(-2),
                    EndDate = DateTime.UtcNow.AddMonths(4),
                    Location = "Rural Areas, Multiple Regions",
                    NGOId = ngoEducation.Id,
                    GoalAmount = 20000.00m
                },
                new NgoProgram
                {
                    Title = "Digital Learning Centers",
                    Description = "Establishing 5 digital learning centers equipped with computers, internet access, and educational software. These centers will serve over 500 students annually.",
                    StartDate = DateTime.UtcNow.AddMonths(-1),
                    EndDate = DateTime.UtcNow.AddMonths(6),
                    Location = "Urban Slums, 5 Locations",
                    NGOId = ngoEducation.Id,
                    GoalAmount = 50000.00m
                },

                // Health Programs
                new NgoProgram
                {
                    Title = "Free Health Checkup Campaign",
                    Description = "Organizing free health checkup camps in remote villages. Includes basic health screening, vaccinations, and distribution of essential medicines.",
                    StartDate = DateTime.UtcNow.AddMonths(-1),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    Location = "Remote Villages, 10 Locations",
                    NGOId = ngoHealth.Id,
                    GoalAmount = 30000.00m
                },
                new NgoProgram
                {
                    Title = "Maternal Health Support",
                    Description = "Providing prenatal and postnatal care to expectant and new mothers. Includes health education, regular checkups, and emergency medical support.",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(12),
                    Location = "Community Health Centers",
                    NGOId = ngoHealth.Id,
                    GoalAmount = 40000.00m
                },

                // Women Empowerment Programs
                new NgoProgram
                {
                    Title = "Vocational Training for Women",
                    Description = "Training 200 women in vocational skills including tailoring, cooking, computer skills, and small business management. Graduates receive startup kits to begin their businesses.",
                    StartDate = DateTime.UtcNow.AddMonths(-3),
                    EndDate = DateTime.UtcNow.AddMonths(9),
                    Location = "Training Centers, 3 Locations",
                    NGOId = ngoWomen.Id,
                    GoalAmount = 35000.00m
                },
                new NgoProgram
                {
                    Title = "Microfinance Loan Program",
                    Description = "Providing interest-free microfinance loans to women entrepreneurs. Loans range from $200-$2000 to help women start or expand their businesses.",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(24),
                    Location = "Multiple Communities",
                    NGOId = ngoWomen.Id,
                    GoalAmount = 60000.00m
                },

                // Children Support Programs
                new NgoProgram
                {
                    Title = "Emergency Shelter for Children",
                    Description = "Building and operating emergency shelters for homeless and at-risk children. Provides safe accommodation, meals, and psychological support.",
                    StartDate = DateTime.UtcNow.AddMonths(-6),
                    EndDate = DateTime.UtcNow.AddMonths(18),
                    Location = "Urban Areas, 2 Shelters",
                    NGOId = ngoChildren.Id,
                    GoalAmount = 80000.00m
                },
                new NgoProgram
                {
                    Title = "Nutrition Program for Malnourished Children",
                    Description = "Providing nutritious meals and supplements to 500 malnourished children. Includes regular health monitoring and nutrition education for parents.",
                    StartDate = DateTime.UtcNow.AddMonths(-2),
                    EndDate = DateTime.UtcNow.AddMonths(10),
                    Location = "Rural Communities",
                    NGOId = ngoChildren.Id,
                    GoalAmount = 25000.00m
                },

                // Environment Programs
                new NgoProgram
                {
                    Title = "Tree Planting Initiative",
                    Description = "Planting 10,000 trees across deforested areas. Involves community participation, environmental education, and long-term maintenance programs.",
                    StartDate = DateTime.UtcNow.AddMonths(-4),
                    EndDate = DateTime.UtcNow.AddMonths(8),
                    Location = "Reforestation Sites, 5 Regions",
                    NGOId = ngoEnvironment.Id,
                    GoalAmount = 45000.00m
                },
                new NgoProgram
                {
                    Title = "Clean Water Access Project",
                    Description = "Installing water wells and filtration systems in 10 communities without access to clean water. Includes maintenance training for local communities.",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(12),
                    Location = "Rural Villages, 10 Locations",
                    NGOId = ngoEnvironment.Id,
                    GoalAmount = 55000.00m
                }
            };

            context.NgoPrograms.AddRange(programs);
            await context.SaveChangesAsync();

            Console.WriteLine("==========================================");
            Console.WriteLine("NGOs and Programs Seeded Successfully!");
            Console.WriteLine($"Created 5 NGOs and {programs.Count} Programs");
            Console.WriteLine($"Total Goal Amount: ${programs.Sum(p => p.GoalAmount ?? 0):N2}");
            Console.WriteLine("==========================================");
        }
    }
}

