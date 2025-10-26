using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class DonationService
    {
        private readonly GiveAidContext _context;

        public DonationService(GiveAidContext context)
        {
            _context = context;
        }

        public async Task<Donation> CreateAsync(DonationDTO dto)
        {
            // Validate payment fields
            if (!PaymentValidator.ValidateCardNumber(dto.CardNumber)
                || !PaymentValidator.ValidateExpiry(dto.CardExpiry)
                || !PaymentValidator.ValidateCvv(dto.CardCvv))
            {
                return null;
            }

            var donation = new Donation
            {
                Amount = dto.Amount,
                CauseName = dto.CauseName,
                PaymentStatus = "Success",
                PaymentMethod = "Card (Dummy)",
                UserId = dto.UserId,
                TransactionReference = "TRX-" + Guid.NewGuid().ToString("N").Substring(0, 12)
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();
            return donation;
        }

        public async Task<List<Donation>> GetAllAsync()
        {
            return await _context.Donations.Include(d => d.User).ToListAsync();
        }

        public async Task<Donation> GetByIdAsync(int id)
        {
            return await _context.Donations.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        }
    }
}
