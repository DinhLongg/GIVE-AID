using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

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
            entity.GoalAmount = model.GoalAmount; // Update goal amount

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

            // Check for duplicate registration (same email + same program)
            var existingRegistration = await _context.ProgramRegistrations
                .FirstOrDefaultAsync(r => r.ProgramId == req.ProgramId && 
                                           r.Email != null && 
                                           r.Email.ToLower() == req.Email.ToLower());
            
            if (existingRegistration != null)
                return (false, "You have already registered for this program.");

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

        /// <summary>
        /// Calculate total donations amount for a specific program
        /// </summary>
        public async Task<decimal> GetTotalDonationsAsync(int programId)
        {
            return await _context.Donations
                .Where(d => d.ProgramId == programId && d.PaymentStatus == "Success")
                .SumAsync(d => d.Amount);
        }

        /// <summary>
        /// Calculate progress percentage for a program (0-100)
        /// </summary>
        public async Task<decimal> GetProgressPercentageAsync(int programId)
        {
            var program = await _context.NgoPrograms.FindAsync(programId);
            if (program == null || program.GoalAmount == null || program.GoalAmount <= 0)
                return 0;

            var totalDonations = await GetTotalDonationsAsync(programId);
            var percentage = (totalDonations / program.GoalAmount.Value) * 100;
            return Math.Min(percentage, 100); // Cap at 100%
        }

        /// <summary>
        /// Get registration count for a specific program
        /// </summary>
        public async Task<int> GetRegistrationCountAsync(int programId)
        {
            return await _context.ProgramRegistrations
                .CountAsync(r => r.ProgramId == programId);
        }

        /// <summary>
        /// Get program with donation statistics
        /// </summary>
        public async Task<NgoProgram?> GetByIdWithStatsAsync(int id)
        {
            var program = await _context.NgoPrograms
                .Include(p => p.NGO)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (program != null)
            {
                // Note: Donation stats are calculated separately, not included in entity
                // Frontend will call GetTotalDonationsAsync and GetProgressPercentageAsync
            }

            return program;
        }
    }
}
