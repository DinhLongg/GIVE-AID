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
            //if (!PaymentValidator.ValidateCardNumber(dto.CardNumber)
            //    || !PaymentValidator.ValidateExpiry(dto.Expiry)
            //    || !PaymentValidator.ValidateCvv(dto.CVV))
            //{
            //    return null;
            //}

            var donation = new Donation
            {
                Amount = dto.Amount,
                CauseName = string.IsNullOrWhiteSpace(dto.Cause) ? "General Donation" : dto.Cause,
                PaymentStatus = "Success",
                PaymentMethod = dto.PaymentMethod,
                UserId = dto.UserId, // null nếu khách donate không login
                TransactionReference = "TRX-" + Guid.NewGuid().ToString("N").Substring(0, 12),
                DonorName = dto.Anonymous ? "Anonymous" : dto.FullName,
                DonorEmail = dto.Email,
                DonorPhone = dto.Phone,
                DonorAddress = dto.Address,
                IsAnonymous = dto.Anonymous,
                SubscribeNewsletter = dto.Newsletter
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
