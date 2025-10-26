using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AboutService
    {
        private readonly GiveAidContext _context;
        public AboutService(GiveAidContext context) { _context = context; }

        public async Task<AboutSection> GetByKeyAsync(string key)
        {
            return await _context.AboutSections.FirstOrDefaultAsync(a => a.Key == key);
        }

        public async Task<AboutSection> CreateAsync(AboutSection model)
        {
            _context.AboutSections.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<bool> UpdateAsync(int id, AboutSection model)
        {
            var e = await _context.AboutSections.FindAsync(id);
            if (e == null) return false;
            e.Key = model.Key;
            e.Title = model.Title;
            e.Content = model.Content;
            e.ExtraJson = model.ExtraJson;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
