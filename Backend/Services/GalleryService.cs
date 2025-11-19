using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class GalleryService
    {
        private readonly GiveAidContext _context;
        private readonly IWebHostEnvironment _env;
        
        public GalleryService(GiveAidContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<Gallery> CreateAsync(Gallery model)
        {
            _context.Galleries.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<List<Gallery>> GetAllAsync()
        {
            return await _context.Galleries.Include(g => g.Program).ToListAsync();
        }

        public async Task<Gallery> GetByIdAsync(int id) => await _context.Galleries.FindAsync(id);

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.Galleries.FindAsync(id);
            if (e == null) return false;
            
            // Delete physical file if it's a local upload (starts with /uploads/)
            if (!string.IsNullOrEmpty(e.ImageUrl) && e.ImageUrl.StartsWith("/uploads/"))
            {
                Give_AID.Helpers.FileHelper.DeleteFile(e.ImageUrl, _env);
            }
            
            _context.Galleries.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<Gallery>> GetPagedAsync(int page, int pageSize, string? search)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 12 : (pageSize > 100 ? 100 : pageSize);

            var query = _context.Galleries
                .Include(g => g.Program)
                .OrderByDescending(g => g.Id)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim()}%";
                query = query.Where(g =>
                    (g.Caption != null && EF.Functions.Like(g.Caption, term)) ||
                    (g.Program != null && g.Program.Title != null && EF.Functions.Like(g.Program.Title, term)));
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Gallery>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };
        }
    }
}
