using Backend.Data;
using Backend.DTOs;
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

        public async Task<PagedResult<NGO>> GetPagedAsync(int page, int pageSize, string? search)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 10 : (pageSize > 100 ? 100 : pageSize);

            var query = _context.NGOs
                .OrderByDescending(n => n.CreatedAt)
                .ThenByDescending(n => n.Id)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim()}%";
                query = query.Where(n =>
                    (n.Name != null && EF.Functions.Like(n.Name, term)) ||
                    (n.Description != null && EF.Functions.Like(n.Description, term)) ||
                    (n.Website != null && EF.Functions.Like(n.Website, term)));
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<NGO>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };
        }
    }
}
