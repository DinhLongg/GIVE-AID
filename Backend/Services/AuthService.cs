//27/10
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
            // Kiểm tra email đã tồn tại chưa
            var exists = await _context.Users.AnyAsync(u => u.Email == req.Email);
            if (exists)
                return (false, "Email đã tồn tại", null);

            // Tạo user mới
            var user = new User
            {
                FullName = req.FullName ?? string.Empty,
                Email = req.Email ?? string.Empty,
                PasswordHash = PasswordHasher.Hash(req.Password ?? string.Empty),
                Phone = req.Phone,
                Address = req.Address,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Tạo token JWT cho user mới đăng ký
            var token = JwtHelper.GenerateToken(user, _config);

            return (true, "Đăng ký thành công", token);
        }

        /// <summary>
        /// Đăng nhập — trả tuple: (thành công, thông báo, token hoặc null)
        /// </summary>
        public async Task<(bool success, string message, string? token)> LoginAsync(LoginRequest req)
        {
            // Kiểm tra tồn tại tài khoản
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
                return (false, "Tài khoản không tồn tại", null);

            // Kiểm tra mật khẩu
            var valid = PasswordHasher.Verify(req.Password ?? string.Empty, user.PasswordHash);
            if (!valid)
                return (false, "Sai mật khẩu", null);

            // Tạo token JWT
            var token = JwtHelper.GenerateToken(user, _config);

            return (true, "Đăng nhập thành công", token);
        }
    }
}
