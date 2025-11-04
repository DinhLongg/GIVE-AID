using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class QueryService
    {
        private readonly GiveAidContext _context;
        private readonly EmailService _emailService;

        public QueryService(GiveAidContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Tạo mới một Query (người dùng gửi câu hỏi / phản hồi)
        /// </summary>
        public async Task<Query> CreateAsync(QueryRequest req)
        {
            var query = new Query
            {
                UserId = req.UserId,
                Subject = req.Subject ?? string.Empty,
                Message = req.Message ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.Queries.Add(query);
            await _context.SaveChangesAsync();

            // Send confirmation email asynchronously (non-blocking)
            if (!string.IsNullOrWhiteSpace(req.Email))
            {
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var emailBody = EmailTemplate.ContactConfirmationEmailTemplate(
                            req.FullName,
                            req.Subject,
                            query.Id.ToString()
                        );
                        await _emailService.SendEmailAsync(
                            req.Email,
                            $"Thank you for contacting Give-AID - #{query.Id}",
                            emailBody
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[Warning] Failed to send confirmation email: {ex.Message}");
                    }
                });
            }

            return query;
        }

        /// <summary>
        /// Lấy danh sách tất cả Query (kèm thông tin User)
        /// </summary>
        public async Task<List<Query>> GetAllAsync()
        {
            return await _context.Queries
                .Include(q => q.User)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy Query theo Id (kèm User)
        /// </summary>
        public async Task<Query?> GetByIdAsync(int id)
        {
            return await _context.Queries
                .Include(q => q.User)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        /// <summary>
        /// Admin phản hồi Query
        /// </summary>
        public async Task<bool> ReplyAsync(int id, string reply)
        {
            var query = await _context.Queries.FindAsync(id);
            if (query == null) return false;

            query.AdminReply = reply;
            query.RepliedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
