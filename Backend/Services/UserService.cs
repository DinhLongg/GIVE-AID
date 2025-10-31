using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class UserService
    {
        private readonly GiveAidContext _context;
        public UserService(GiveAidContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateRoleAsync(int id, string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            user.Role = role;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
