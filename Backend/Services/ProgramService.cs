using Give_AID.API.Models;
using Give_AID.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Give_AID.API.Services
{
    public class ProgramService
    {
        private readonly GiveAidContext _context;

        public ProgramService(GiveAidContext context)
        {
            _context = context;
        }

        public async Task<List<NgoProgram>> GetAllAsync()
        {
            // ✅ Dòng này giờ hợp lệ
            return await _context.NgoPrograms.Include(p => p.NGO).ToListAsync();
        }

        public async Task<NgoProgram?> GetByIdAsync(int id)
        {
            return await _context.NgoPrograms.Include(p => p.NGO)
                                             .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<NgoProgram> CreateAsync(NgoProgram model)
        {
            _context.NgoPrograms.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<bool> UpdateAsync(int id, NgoProgram model)
        {
            var entity = await _context.NgoPrograms.FindAsync(id);
            if (entity == null) return false;

            entity.Title = model.Title;
            entity.Description = model.Description;
            entity.StartDate = model.StartDate;
            entity.EndDate = model.EndDate;
            entity.Location = model.Location;
            entity.NGOId = model.NGOId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.NgoPrograms.FindAsync(id);
            if (entity == null) return false;

            _context.NgoPrograms.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
