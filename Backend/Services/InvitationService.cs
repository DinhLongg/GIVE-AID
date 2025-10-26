using Backend.Data;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class InvitationService
    {
        private readonly GiveAidContext _context;
        private readonly EmailService _emailService;

        public InvitationService(GiveAidContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Gửi lời mời tham gia Give-AID và lưu vào cơ sở dữ liệu.
        /// </summary>
        /// <param name="fromUserId">ID người gửi</param>
        /// <param name="toEmail">Email người nhận (có thể null hoặc rỗng)</param>
        /// <param name="message">Nội dung lời mời</param>
        public async Task<Invitation?> SendAsync(int fromUserId, string? toEmail, string? message)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
                return null; // Không gửi nếu email trống/null

            // Lấy thông tin người gửi (nếu có)
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Id == fromUserId);
            var senderName = sender?.FullName ?? "Thành viên Give-AID";

            // Tạo mã token mời ngắn
            string token = Guid.NewGuid().ToString("N")[..8];

            // Tạo bản ghi lời mời
            var invitation = new Invitation
            {
                FromUserId = fromUserId,
                ToEmail = toEmail,
                Message = message ?? string.Empty,
                Token = token,
                CreatedAt = DateTime.UtcNow
            };

            _context.Invitations.Add(invitation);
            await _context.SaveChangesAsync();

            // Tạo nội dung email
            string emailBody = EmailTemplate.InvitationTemplate(senderName, message, token);

            // Gửi email (bắt lỗi nhẹ để tránh crash nếu lỗi SMTP)
            try
            {
                await _emailService.SendEmailAsync(toEmail, "Invitation to join Give-AID", emailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Warning] Failed to send email: {ex.Message}");
            }

            return invitation;
        }
    }
}
