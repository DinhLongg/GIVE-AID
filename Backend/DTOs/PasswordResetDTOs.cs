using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ForgotPasswordRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = "";
    }

    public class ResetPasswordRequest
    {
        [Required]
        public string Token { get; set; } = "";

        [Required, MinLength(6)]
        public string NewPassword { get; set; } = "";

        [Required]
        public string ConfirmPassword { get; set; } = "";
    }
}

