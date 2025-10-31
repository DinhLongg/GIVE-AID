using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterRequest
    {
        [Required, MaxLength(120)]
        public string? FullName { get; set; }

        [Required, MaxLength(50), MinLength(3)]
        public string? Username { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, MinLength(6)]
        public string? Password { get; set; }

        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}
