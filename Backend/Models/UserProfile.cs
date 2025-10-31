using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserProfile
    {
        public int Id { get; set; }

        // Basic Information
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }

        // Address
        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }

        // Professional
        public string? Profession { get; set; }
        public string? Organization { get; set; }
        public string? WorkPhone { get; set; }
        public string? WorkEmail { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
