using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
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
            return await _context.NgoPrograms
                                 .Include(p => p.NGO)
                                 .OrderByDescending(p => p.Id)
                                 .ToListAsync();
        }

        public async Task<NgoProgram?> GetByIdAsync(int id)
        {
            return await _context.NgoPrograms
                                 .Include(p => p.NGO)
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

        // ✅ User register to join a program
        public async Task<(bool success, string message)> RegisterAsync(ProgramRegistrationRequest req)
        {
            var program = await _context.NgoPrograms.FindAsync(req.ProgramId);
            if (program == null)
                return (false, "Program not found");

            var registration = new ProgramRegistration
            {
                ProgramId = req.ProgramId,
                FullName = req.FullName,
                Email = req.Email,
                Phone = req.Phone,
                Notes = req.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.ProgramRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            return (true, "You have successfully registered for this program.");
        }
    }
}
