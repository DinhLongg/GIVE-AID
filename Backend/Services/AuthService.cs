using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System;
using System.Threading;

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
            // Optimize: Check email and username in a single query
            var existingUser = await _context.Users
                .Where(u => u.Email == req.Email || u.Username == req.Username)
                .Select(u => new { u.Email, u.Username })
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                if (existingUser.Email == req.Email)
                    return (false, "Email already exists", null);
                if (existingUser.Username == req.Username)
                    return (false, "Username already exists", null);
            }

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

            // Send verification email asynchronously (fire-and-forget) to not block response
            // This improves response time significantly
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
            var emailBody = EmailTemplate.VerificationEmailTemplate(user.FullName, verificationLink, verificationToken);
            
            // Fire-and-forget: Send email asynchronously without awaiting
            _ = Task.Run(async () =>
            {
                try
                {
                    // Set timeout for email sending (5 seconds max)
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                    var emailTask = _emailService.SendEmailAsync(
                        user.Email,
                        "Verify Your Give-AID Account",
                        emailBody
                    );
                    var timeoutTask = Task.Delay(TimeSpan.FromSeconds(5), cts.Token);
                    
                    var completedTask = await Task.WhenAny(emailTask, timeoutTask);
                    if (completedTask == timeoutTask)
                    {
                        cts.Cancel();
                        Console.WriteLine($"[Warning] Email sending timeout for {user.Email}. Email will be sent in background.");
                    }
                    else
                    {
                        var emailSent = await emailTask;
                        if (emailSent)
                        {
                            Console.WriteLine($"[Info] Verification email sent successfully to {user.Email}");
                        }
                        else
                        {
                            Console.WriteLine($"[Warning] Failed to send verification email to {user.Email}. User can use 'Resend Verification' feature.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log exception but don't fail registration
                    Console.WriteLine($"[Error] Exception while sending verification email to {user.Email}: {ex.Message}");
                }
            });

            // Return immediately without waiting for email to send
            // This significantly improves response time (reduces from ~1-2s to ~100-200ms)
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

            // Send verification email asynchronously (fire-and-forget) to not block response
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
            var emailBody = EmailTemplate.VerificationEmailTemplate(user.FullName, verificationLink, verificationToken);
            
            // Fire-and-forget: Send email asynchronously without awaiting
            _ = Task.Run(async () =>
            {
                try
                {
                    // Set timeout for email sending (5 seconds max)
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                    var emailTask = _emailService.SendEmailAsync(
                        user.Email,
                        "Verify Your Give-AID Account",
                        emailBody
                    );
                    var timeoutTask = Task.Delay(TimeSpan.FromSeconds(5), cts.Token);
                    
                    var completedTask = await Task.WhenAny(emailTask, timeoutTask);
                    if (completedTask == timeoutTask)
                    {
                        cts.Cancel();
                        Console.WriteLine($"[Warning] Email resend timeout for {user.Email}");
                    }
                    else
                    {
                        var emailSent = await emailTask;
                        if (emailSent)
                        {
                            Console.WriteLine($"[Info] Resend verification email sent successfully to {user.Email}");
                        }
                        else
                        {
                            Console.WriteLine($"[Warning] Failed to resend verification email to {user.Email}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Error] Exception while resending verification email to {user.Email}: {ex.Message}");
                }
            });

            // Return immediately without waiting for email to send
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

        /// <summary>
        /// Generate a random password reset token
        /// </summary>
        private string GeneratePasswordResetToken()
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
        /// Forgot password - Send password reset email
        /// </summary>
        public async Task<(bool success, string message)> ForgotPasswordAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return (false, "Email is required");

            // Find user by email (don't reveal if email exists for security)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
            {
                // Don't reveal if email exists - return success anyway (security best practice)
                return (true, "If the email exists in our system, a password reset link has been sent.");
            }

            // Generate password reset token
            var resetToken = GeneratePasswordResetToken();
            user.PasswordResetToken = PasswordHasher.Hash(resetToken); // Hash token before saving
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

            await _context.SaveChangesAsync();

            // Send password reset email asynchronously (fire-and-forget) to not block response
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={resetToken}";
            var emailBody = EmailTemplate.PasswordResetEmailTemplate(user.FullName, resetLink, resetToken);
            
            // Fire-and-forget: Send email asynchronously without awaiting
            _ = Task.Run(async () =>
            {
                try
                {
                    // Set timeout for email sending (5 seconds max)
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                    var emailTask = _emailService.SendEmailAsync(
                        user.Email,
                        "Reset Your Give-AID Password",
                        emailBody
                    );
                    var timeoutTask = Task.Delay(TimeSpan.FromSeconds(5), cts.Token);
                    
                    var completedTask = await Task.WhenAny(emailTask, timeoutTask);
                    if (completedTask == timeoutTask)
                    {
                        cts.Cancel();
                        Console.WriteLine($"[Warning] Password reset email sending timeout for {user.Email}");
                    }
                    else
                    {
                        var emailSent = await emailTask;
                        if (emailSent)
                        {
                            Console.WriteLine($"[Info] Password reset email sent successfully to {user.Email}");
                        }
                        else
                        {
                            Console.WriteLine($"[Warning] Failed to send password reset email to {user.Email}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Error] Exception while sending password reset email to {user.Email}: {ex.Message}");
                }
            });

            // Return immediately without waiting for email to send
            return (true, "If the email exists in our system, a password reset link has been sent. Please check your email.");
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        public async Task<(bool success, string message)> ResetPasswordAsync(ResetPasswordRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Token))
                return (false, "Reset token is required");

            if (string.IsNullOrWhiteSpace(req.NewPassword))
                return (false, "New password is required");

            if (req.NewPassword.Length < 6)
                return (false, "Password must be at least 6 characters");

            if (req.NewPassword != req.ConfirmPassword)
                return (false, "Passwords do not match");

            // URL decode token in case it was encoded
            var token = req.Token;
            try
            {
                var decoded = Uri.UnescapeDataString(token);
                if (decoded != token)
                {
                    Console.WriteLine($"[Debug] Password reset token was URL encoded, decoded to: '{decoded}'");
                    token = decoded;
                }
            }
            catch
            {
                Console.WriteLine($"[Debug] Password reset token appears to be already decoded or invalid format");
            }

            // Find user with matching token (hash comparison)
            var users = await _context.Users
                .Where(u => u.PasswordResetToken != null)
                .ToListAsync();
            
            Console.WriteLine($"[Debug] Found {users.Count} users with password reset tokens");

            User? user = null;

            // Try to find user by verifying token hash
            foreach (var u in users)
            {
                try
                {
                    // BCrypt verify will check if token matches the hash
                    var isValid = PasswordHasher.Verify(token, u.PasswordResetToken);
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
                    Console.WriteLine($"[Debug] Error verifying password reset token for user {u.Id}: {ex.Message}");
                    // Continue to next user
                }
            }

            if (user == null)
            {
                Console.WriteLine($"[Warning] No user found matching password reset token: '{token}'");
                return (false, "Invalid or expired reset token");
            }

            // Check if token has expired
            if (user.PasswordResetTokenExpiry.HasValue && 
                user.PasswordResetTokenExpiry.Value < DateTime.UtcNow)
                return (false, "Reset token has expired. Please request a new password reset.");

            // Reset password
            user.PasswordHash = PasswordHasher.Hash(req.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            Console.WriteLine($"[Info] Password reset successfully for user {user.Id} ({user.Email})");
            return (true, "Password has been reset successfully. You can now login with your new password.");
        }
    }
}
