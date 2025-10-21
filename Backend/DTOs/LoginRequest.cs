using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
