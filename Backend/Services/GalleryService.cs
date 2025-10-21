using Give_AID.API.Data;
using Give_AID.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Give_AID.API.Services
{
    public class GalleryService
    {
        private readonly GiveAidContext _context;
        public GalleryService(GiveAidContext context) { _context = context; }

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
            _context.Galleries.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
