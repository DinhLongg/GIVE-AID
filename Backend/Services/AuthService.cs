using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly GiveAidContext _context;
        private readonly IConfiguration _config;

        public AuthService(GiveAidContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token for new user
            var token = JwtHelper.GenerateToken(user, _config);

            return (true, "Registration successful", token);
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
