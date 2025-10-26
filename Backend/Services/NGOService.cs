using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class NGOService
    {
        private readonly GiveAidContext _context;
        public NGOService(GiveAidContext context) { _context = context; }

        public async Task<NGO> CreateAsync(NGO model)
        {
            _context.NGOs.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<List<NGO>> GetAllAsync()
        {
            return await _context.NGOs.ToListAsync();
        }

        public async Task<NGO> GetByIdAsync(int id)
        {
            return await _context.NGOs.FindAsync(id);
        }

        public async Task<bool> UpdateAsync(int id, NGO model)
        {
            var existing = await _context.NGOs.FindAsync(id);
            if (existing == null) return false;
            existing.Name = model.Name;
            existing.Description = model.Description;
            existing.LogoUrl = model.LogoUrl;
            existing.Website = model.Website;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.NGOs.FindAsync(id);
            if (existing == null) return false;
            _context.NGOs.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
