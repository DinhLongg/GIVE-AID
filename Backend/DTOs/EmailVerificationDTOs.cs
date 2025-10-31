using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; } = "";
    }

    public class ResendVerificationRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = "";
    }
}

