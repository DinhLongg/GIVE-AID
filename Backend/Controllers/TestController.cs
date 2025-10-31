using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly EmailService _emailService;

        public TestController(EmailService emailService)
        {
            _emailService = emailService;
        }

        /// <summary>
        /// Test email service - Send a test email
        /// </summary>
        [HttpPost("send-email")]
        public async Task<IActionResult> SendTestEmail([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Email is required" });
            }

            var htmlBody = @"
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 5px 5px; }
                            .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h1>🎉 Give-AID Test Email</h1>
                            </div>
                            <div class='content'>
                                <p>Hello!</p>
                                <p>This is a <strong>test email</strong> from Give-AID API.</p>
                                <p>If you received this email, it means your email service is configured correctly! ✅</p>
                                <p>Email sent at: <strong>" + DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC") + @"</strong></p>
                                <p>Best regards,<br>Give-AID Team</p>
                            </div>
                        </div>
                    </body>
                </html>";

            var result = await _emailService.SendEmailAsync(
                email,
                "Test Email from Give-AID API",
                htmlBody
            );

            if (result)
            {
                return Ok(new 
                { 
                    success = true, 
                    message = $"Test email sent successfully to {email}. Please check your inbox." 
                });
            }
            else
            {
                return BadRequest(new 
                { 
                    success = false, 
                    message = "Failed to send email. Please check your SMTP configuration in appsettings.json" 
                });
            }
        }
    }
}

