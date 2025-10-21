using Give_AID.API.Services;
using Give_AID.API.Data;
using Give_AID.API.Models;
using System;
using System.Threading.Tasks;

namespace Give_AID.API.Services
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

        public async Task<Invitation> SendAsync(int fromUserId, string toEmail, string message)
        {
            var inv = new Invitation
            {
                FromUserId = fromUserId,
                ToEmail = toEmail,
                Message = message,
                Token = Guid.NewGuid().ToString("N")
            };

            _context.Invitations.Add(inv);
            await _context.SaveChangesAsync();

            // send email (basic)
            await _emailService.SendEmailAsync(toEmail, "Invitation to join Give-AID", $"You were invited: {message} \nToken: {inv.Token}");

            return inv;
        }
    }
}
