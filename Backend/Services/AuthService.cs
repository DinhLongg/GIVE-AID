using Give_AID.API.Data;
using Give_AID.API.DTOs;
using Give_AID.API.Helpers;
using Give_AID.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Give_AID.API.Services
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

        public async Task<User> RegisterAsync(RegisterRequest req)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == req.Email);
            if (exists) return null;

            var user = new User
            {
                FullName = req.FullName,
                Email = req.Email,
                PasswordHash = PasswordHasher.Hash(req.Password),
                Phone = req.Phone,
                Address = req.Address,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string> LoginAsync(LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return null;
            if (!PasswordHasher.Verify(req.Password, user.PasswordHash)) return null;
            var token = JwtHelper.GenerateToken(user, _config);
            return token;
        }
    }
}
