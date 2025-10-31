//27/10
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class LoginRequest
    {
        [Required]
        public string? UsernameOrEmail { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
