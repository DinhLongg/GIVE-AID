using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ChangePasswordRequest
    {
        [Required]
        public string? CurrentPassword { get; set; }

        [Required, MinLength(6)]
        public string? NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "New password and confirm password do not match")]
        public string? ConfirmPassword { get; set; }
    }
}

