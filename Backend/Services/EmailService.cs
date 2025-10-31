using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Backend.Services
{
    /// <summary>
    /// Dịch vụ gửi email cơ bản cho hệ thống Give-AID.
    /// </summary>
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Gửi email dùng cấu hình trong appsettings.json.
        /// An toàn với giá trị null (không cảnh báo CS8604).
        /// </summary>
        public async Task<bool> SendEmailAsync(string? to, string? subject, string? body)
        {
            // Đọc cấu hình SMTP
            string? smtpHost = _config["Smtp:Host"];
            string? smtpPortStr = _config["Smtp:Port"];
            string? smtpUser = _config["Smtp:User"];
            string? smtpPass = _config["Smtp:Pass"];
            string? from = _config["Smtp:From"] ?? smtpUser;

            // Kiểm tra điều kiện cơ bản
            if (string.IsNullOrWhiteSpace(smtpHost) || string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(to))
            {
                Console.WriteLine("[Warning] Email skipped: missing configuration or recipient.");
                Console.WriteLine($"[Debug] SMTP Config - Host: '{smtpHost}', User: '{smtpUser}', From: '{from}', To: '{to}'");
                return false;
            }

            // Check if password is configured
            if (string.IsNullOrWhiteSpace(smtpPass))
            {
                Console.WriteLine("[Warning] Email skipped: SMTP password is not configured.");
                Console.WriteLine("[Error] Please set 'Smtp:Pass' in appsettings.json with your Gmail App Password.");
                return false;
            }

            int smtpPort = int.TryParse(smtpPortStr, out int parsedPort) ? parsedPort : 25;

            try
            {
                using var msg = new MailMessage(from, to, subject ?? "(No subject)", body ?? "(No content)")
                {
                    IsBodyHtml = body?.TrimStart().StartsWith("<") == true
                };

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUser ?? from, smtpPass ?? string.Empty),
                    EnableSsl = true
                };

                await client.SendMailAsync(msg);
                Console.WriteLine($"[Info] Email sent successfully to {to}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] Failed to send email to {to}: {ex.Message}");
                Console.WriteLine($"[Error] Exception type: {ex.GetType().Name}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[Error] Inner exception: {ex.InnerException.Message}");
                }
                return false;
            }
        }
    }
}
