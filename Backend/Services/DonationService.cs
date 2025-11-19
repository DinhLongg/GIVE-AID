using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class DonationService
    {
        private readonly GiveAidContext _context;
        private readonly EmailService _emailService;

        public DonationService(GiveAidContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<Donation> CreateAsync(DonationDTO dto)
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new ArgumentException("Email is required");
            }

            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                throw new ArgumentException("Full name is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Cause))
            {
                throw new ArgumentException("Cause is required");
            }

            // Ensure DonorName and DonorEmail are not empty (database requires non-null)
            var donorName = dto.Anonymous ? "Anonymous" : (string.IsNullOrWhiteSpace(dto.FullName) ? "Donor" : dto.FullName.Trim());
            var donorEmail = dto.Email.Trim();
            
            // Ensure minimum length for required fields
            if (string.IsNullOrEmpty(donorName))
                donorName = "Donor";
            if (string.IsNullOrEmpty(donorEmail))
                throw new ArgumentException("Email cannot be empty");

            var donation = new Donation
            {
                Amount = dto.Amount,
                CauseName = string.IsNullOrWhiteSpace(dto.Cause) ? "General Donation" : dto.Cause.Trim(),
                PaymentStatus = "Success",
                PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "Card" : dto.PaymentMethod.Trim(),
                UserId = dto.UserId, // null nếu khách donate không login
                ProgramId = dto.ProgramId, // Link to specific program if provided
                TransactionReference = "TRX-" + Guid.NewGuid().ToString("N").Substring(0, 12),
                DonorName = donorName,
                DonorEmail = donorEmail,
                DonorPhone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
                DonorAddress = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
                IsAnonymous = dto.Anonymous,
                SubscribeNewsletter = dto.Newsletter
            };

            try
            {
                Console.WriteLine($"[DonationService] Creating donation: Amount={donation.Amount}, CauseName={donation.CauseName}, DonorName={donation.DonorName}, DonorEmail={donation.DonorEmail}");
                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();
                Console.WriteLine($"[DonationService] Donation created successfully with ID: {donation.Id}");

                // Send confirmation email asynchronously (non-blocking)
                if (!string.IsNullOrWhiteSpace(donorEmail) && !dto.Anonymous)
                {
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            var emailBody = EmailTemplate.DonationReceiptTemplate(
                                donorName,
                                donation.Amount,
                                donation.CauseName,
                                donation.TransactionReference,
                                donation.CreatedAt
                            );
                            
                            var emailSent = await _emailService.SendEmailAsync(
                                donorEmail,
                                $"Thank you for your donation - #{donation.TransactionReference}",
                                emailBody
                            );

                            if (emailSent)
                            {
                                Console.WriteLine($"[DonationService] Confirmation email sent successfully to {donorEmail}");
                            }
                            else
                            {
                                Console.WriteLine($"[DonationService] Failed to send confirmation email to {donorEmail}");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[DonationService] Error sending confirmation email to {donorEmail}: {ex.Message}");
                        }
                    });
                }
                else if (dto.Anonymous)
                {
                    Console.WriteLine($"[DonationService] Skipping email confirmation for anonymous donation");
                }

                return donation;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
            {
                Console.WriteLine($"[DonationService] Database error: {dbEx.Message}");
                Console.WriteLine($"[DonationService] Inner exception: {dbEx.InnerException?.Message}");
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"[DonationService] Inner exception details: {dbEx.InnerException}");
                }
                throw new Exception($"Database error while saving donation: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DonationService] General error: {ex.Message}");
                Console.WriteLine($"[DonationService] Stack trace: {ex.StackTrace}");
                throw new Exception($"Failed to save donation: {ex.Message}", ex);
            }
        }

        public async Task<List<Donation>> GetAllAsync()
        {
            try
            {
                // Order by newest first
                return await _context.Donations
                    .Include(d => d.User)
                    .OrderByDescending(d => d.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DonationService] Error in GetAllAsync: {ex.Message}");
                Console.WriteLine($"[DonationService] StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[DonationService] Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<Donation> GetByIdAsync(int id)
        {
            return await _context.Donations.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<(PagedResult<Donation> Data, DonationSummaryDto Summary)> GetAdminPagedAsync(
            int page,
            int pageSize,
            string? search,
            string? status)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 10 : (pageSize > 100 ? 100 : pageSize);

            var listingQuery = _context.Donations
                .Include(d => d.User)
                .OrderByDescending(d => d.CreatedAt)
                .AsQueryable();

            var aggregateQuery = _context.Donations.AsQueryable();

            listingQuery = ApplyFilters(listingQuery, search, status);
            aggregateQuery = ApplyFilters(aggregateQuery, search, status);

            var totalItems = await aggregateQuery.CountAsync();
            var items = await listingQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var summary = new DonationSummaryDto
            {
                TotalDonations = totalItems,
                TotalAmount = await aggregateQuery.SumAsync(d => (decimal?)d.Amount) ?? 0m,
                SuccessDonations = await aggregateQuery.Where(d => d.PaymentStatus == "Success").CountAsync(),
                SuccessAmount = await aggregateQuery
                    .Where(d => d.PaymentStatus == "Success")
                    .SumAsync(d => (decimal?)d.Amount) ?? 0m
            };

            return (new PagedResult<Donation>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            }, summary);
        }

        private static IQueryable<Donation> ApplyFilters(
            IQueryable<Donation> query,
            string? search,
            string? status)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = $"%{search.Trim()}%";
                query = query.Where(d =>
                    (d.DonorName != null && EF.Functions.Like(d.DonorName, term)) ||
                    (d.DonorEmail != null && EF.Functions.Like(d.DonorEmail, term)) ||
                    (d.CauseName != null && EF.Functions.Like(d.CauseName, term)) ||
                    (d.TransactionReference != null && EF.Functions.Like(d.TransactionReference, term)));
            }

            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                string normalizedStatus = status.Trim();
                if (status.Equals("success", StringComparison.OrdinalIgnoreCase)) normalizedStatus = "Success";
                else if (status.Equals("pending", StringComparison.OrdinalIgnoreCase)) normalizedStatus = "Pending";
                else if (status.Equals("failed", StringComparison.OrdinalIgnoreCase)) normalizedStatus = "Failed";

                query = query.Where(d => d.PaymentStatus == normalizedStatus);
            }

            return query;
        }

        /// <summary>
        /// Lấy danh sách donations của một user cụ thể
        /// </summary>
        public async Task<List<Donation>> GetByUserIdAsync(int userId)
        {
            try
            {
                // Order by newest first
                return await _context.Donations
                    .Where(d => d.UserId == userId)
                    .OrderByDescending(d => d.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DonationService] Error in GetByUserIdAsync: {ex.Message}");
                Console.WriteLine($"[DonationService] StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[DonationService] Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }
    }
}
