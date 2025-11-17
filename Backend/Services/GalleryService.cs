using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
    }
}
