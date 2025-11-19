using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class PartnerService
    {
        private readonly GiveAidContext _context;
        public PartnerService(GiveAidContext context) { _context = context; }

        public async Task<Partner> CreateAsync(Partner p)
        {
            _context.Partners.Add(p);
            await _context.SaveChangesAsync();
            return p;
        }

        public async Task<List<Partner>> GetAllAsync()
        {
            return await _context.Partners.ToListAsync();
        }

        public async Task<Partner> GetByIdAsync(int id) => await _context.Partners.FindAsync(id);

        public async Task<bool> UpdateAsync(int id, Partner model)
        {
            var e = await _context.Partners.FindAsync(id);
            if (e == null) return false;
            e.Name = model.Name;
            e.LogoUrl = model.LogoUrl;
            e.Website = model.Website;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.Partners.FindAsync(id);
            if (e == null) return false;
            _context.Partners.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<Partner>> GetPagedAsync(int page, int pageSize, string? search)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 12 : (pageSize > 100 ? 100 : pageSize);

            var query = _context.Partners
                .OrderByDescending(p => p.Id)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim()}%";
                query = query.Where(p =>
                    (p.Name != null && EF.Functions.Like(p.Name, term)) ||
                    (p.Website != null && EF.Functions.Like(p.Website, term)));
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Partner>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };
        }
    }
}
