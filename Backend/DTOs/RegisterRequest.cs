using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.DTOs
{
    public class RegisterRequest
    {
        [Required, MaxLength(120)]
        public string? FullName { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, MinLength(6)]
        public string? Password { get; set; }

        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}
