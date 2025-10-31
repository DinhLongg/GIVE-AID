using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly GiveAidContext _context;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public AuthService(GiveAidContext context, IConfiguration config, EmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        /// <summary>
        /// Đăng ký tài khoản mới — trả tuple: (thành công, thông báo, token hoặc null)
        /// </summary>
        public async Task<(bool success, string message, string? token)> RegisterAsync(RegisterRequest req)
        {
            // Check if email already exists
            var emailExists = await _context.Users.AnyAsync(u => u.Email == req.Email);
            if (emailExists)
                return (false, "Email already exists", null);

            // Check if username already exists
            var usernameExists = await _context.Users.AnyAsync(u => u.Username == req.Username);
            if (usernameExists)
                return (false, "Username already exists", null);

            // Create new user
            var user = new User
            {
                FullName = req.FullName ?? string.Empty,
                Username = req.Username ?? string.Empty,
                Email = req.Email ?? string.Empty,
                PasswordHash = PasswordHasher.Hash(req.Password ?? string.Empty),
                Phone = req.Phone,
                Address = req.Address,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            // Generate email verification token
            var verificationToken = GenerateEmailVerificationToken();
            user.EmailVerificationToken = PasswordHasher.Hash(verificationToken); // Hash token before saving
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours
            user.EmailVerified = false;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send verification email
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
            var emailBody = EmailTemplate.VerificationEmailTemplate(user.FullName, verificationLink, verificationToken);
            
            try
            {
                var emailSent = await _emailService.SendEmailAsync(
                    user.Email,
                    "Verify Your Give-AID Account",
                    emailBody
                );

                if (!emailSent)
                {
                    // Email sending failed - log but don't fail registration
                    Console.WriteLine($"[Warning] Failed to send verification email to {user.Email}. User was created but email verification is pending.");
                    return (true, $"Registration successful! However, we couldn't send verification email. Please use 'Resend Verification' feature or contact support. User ID: {user.Id}", null);
                }

                Console.WriteLine($"[Info] Verification email sent successfully to {user.Email}");
            }
            catch (Exception ex)
            {
                // Log exception but don't fail registration
                Console.WriteLine($"[Error] Exception while sending verification email to {user.Email}: {ex.Message}");
                Console.WriteLine($"[Error] Stack trace: {ex.StackTrace}");
                return (true, $"Registration successful! However, we couldn't send verification email. Please use 'Resend Verification' feature. User ID: {user.Id}", null);
            }

            // Don't return JWT token yet - user must verify email first
            return (true, "Registration successful! Please check your email to verify your account.", null);
        }

        /// <summary>
        /// Generate a random email verification token
        /// </summary>
        private string GenerateEmailVerificationToken()
        {
            // Generate a secure random token (32 characters)
            var bytes = new byte[24];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "")
                .Substring(0, 32);
        }

        /// <summary>
        /// Verify email with token
        /// </summary>
        public async Task<(bool success, string message)> VerifyEmailAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return (false, "Invalid verification token");

            // Log token for debugging
            Console.WriteLine($"[Debug] VerifyEmailAsync - Token received: '{token}' (Length: {token?.Length})");

            // URL decode token in case it was encoded (try-catch to handle already decoded tokens)
            try
            {
                var decoded = Uri.UnescapeDataString(token);
                if (decoded != token)
                {
                    Console.WriteLine($"[Debug] Token was URL encoded, decoded to: '{decoded}'");
                    token = decoded;
                }
            }
            catch
            {
                Console.WriteLine($"[Debug] Token appears to be already decoded or invalid format");
            }

            // Find user with matching token (hash comparison)
            // We need to check all users because token is hashed
            var users = await _context.Users
                .Where(u => u.EmailVerificationToken != null && !u.EmailVerified)
                .ToListAsync();
            
            Console.WriteLine($"[Debug] Found {users.Count} users with unverified email tokens");

            User? user = null;

            // Try to find user by verifying token hash
            foreach (var u in users)
            {
                try
                {
                    // BCrypt verify will check if token matches the hash
                    var isValid = PasswordHasher.Verify(token, u.EmailVerificationToken);
                    Console.WriteLine($"[Debug] Checking user {u.Id} ({u.Email}) - Token match: {isValid}");
                    
                    if (isValid)
                    {
                        user = u;
                        Console.WriteLine($"[Info] Found matching user: {u.Id} ({u.Email})");
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Debug] Error verifying token for user {u.Id}: {ex.Message}");
                    // Continue to next user
                }
            }

            if (user == null)
            {
                Console.WriteLine($"[Warning] No user found matching token: '{token}'");
                return (false, "Invalid or expired verification token");
            }

            // Check if token has expired
            if (user.EmailVerificationTokenExpiry.HasValue && 
                user.EmailVerificationTokenExpiry.Value < DateTime.UtcNow)
                return (false, "Verification token has expired. Please request a new verification email.");

            // Check if already verified
            if (user.EmailVerified)
                return (false, "Email is already verified");

            // Verify email
            user.EmailVerified = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;

            await _context.SaveChangesAsync();

            return (true, "Email verified successfully! You can now login.");
        }

        /// <summary>
        /// Resend verification email
        /// </summary>
        public async Task<(bool success, string message)> ResendVerificationEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
                // Don't reveal if email exists (security)
                return (true, "If email exists, verification email has been sent.");

            if (user.EmailVerified)
                return (false, "Email is already verified");

            // Generate new verification token
            var verificationToken = GenerateEmailVerificationToken();
            user.EmailVerificationToken = PasswordHasher.Hash(verificationToken);
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);

            await _context.SaveChangesAsync();

            // Send verification email
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
            var emailBody = EmailTemplate.VerificationEmailTemplate(user.FullName, verificationLink, verificationToken);
            
            try
            {
                var emailSent = await _emailService.SendEmailAsync(
                    user.Email,
                    "Verify Your Give-AID Account",
                    emailBody
                );

                if (!emailSent)
                {
                    Console.WriteLine($"[Warning] Failed to resend verification email to {user.Email}");
                    return (false, "Failed to send verification email. Please check your SMTP configuration in appsettings.json");
                }

                Console.WriteLine($"[Info] Resend verification email sent successfully to {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] Exception while resending verification email to {user.Email}: {ex.Message}");
                return (false, $"Failed to send verification email: {ex.Message}. Please check your SMTP configuration.");
            }

            return (true, "Verification email has been sent. Please check your inbox.");
        }

        /// <summary>
        /// Đăng nhập — trả tuple: (thành công, thông báo, token hoặc null)
        /// </summary>
        public async Task<(bool success, string message, string? token)> LoginAsync(LoginRequest req)
        {
            // Check if input is email or username
            var isEmail = req.UsernameOrEmail?.Contains("@") == true;
            
            // Find user by username or email
            var user = isEmail
                ? await _context.Users.FirstOrDefaultAsync(u => u.Email == req.UsernameOrEmail)
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == req.UsernameOrEmail);
            
            if (user == null)
                return (false, "Invalid username/email or password", null);

            // Verify password
            var valid = PasswordHasher.Verify(req.Password ?? string.Empty, user.PasswordHash);
            if (!valid)
                return (false, "Invalid username/email or password", null);

            // Check if email is verified
            if (!user.EmailVerified)
                return (false, "Please verify your email before logging in. Check your inbox for verification link or request a new one.", null);

            // Generate JWT token
            var token = JwtHelper.GenerateToken(user, _config);

            return (true, "Login successful", token);
        }

        /// <summary>
        /// Change password for user
        /// </summary>
        public async Task<(bool success, string message)> ChangePasswordAsync(int userId, ChangePasswordRequest req)
        {
            // Find user
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return (false, "User not found");

            // Verify current password
            var valid = PasswordHasher.Verify(req.CurrentPassword ?? string.Empty, user.PasswordHash);
            if (!valid)
                return (false, "Current password is incorrect");

            // Check new password and confirm password match
            if (req.NewPassword != req.ConfirmPassword)
                return (false, "New password and confirm password do not match");

            // Check minimum length
            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
                return (false, "New password must be at least 6 characters");

            // Update password
            user.PasswordHash = PasswordHasher.Hash(req.NewPassword);
            await _context.SaveChangesAsync();

            return (true, "Password changed successfully");
        }
    }
}
