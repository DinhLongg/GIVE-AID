using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UpdateProfileRequest
    {
        [MaxLength(120)]
        public string? FullName { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }
    }
}

