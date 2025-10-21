using Give_AID.API.Data;
using Give_AID.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Give_AID.API.Services
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
    }
}
