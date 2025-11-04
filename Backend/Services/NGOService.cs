using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<NGO>> GetAllAsync(bool includePrograms = false)
        {
            if (includePrograms)
            {
                return await _context.NGOs
                    .Include(n => n.NgoPrograms)
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();
            }
            return await _context.NGOs
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<NGO?> GetByIdAsync(int id, bool includePrograms = false)
        {
            if (includePrograms)
            {
                return await _context.NGOs
                    .Include(n => n.NgoPrograms)
                    .FirstOrDefaultAsync(n => n.Id == id);
            }
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

        public async Task<(bool success, string message)> DeleteAsync(int id)
        {
            var existing = await _context.NGOs
                .Include(n => n.NgoPrograms)
                .FirstOrDefaultAsync(n => n.Id == id);
            
            if (existing == null) 
                return (false, "NGO not found");

            // Check if NGO has associated programs
            if (existing.NgoPrograms != null && existing.NgoPrograms.Any())
            {
                var programCount = existing.NgoPrograms.Count;
                return (false, $"Cannot delete NGO. It has {programCount} associated program(s). Please delete or reassign the programs first.");
            }

            _context.NGOs.Remove(existing);
            await _context.SaveChangesAsync();
            return (true, "NGO deleted successfully");
        }
    }
}
