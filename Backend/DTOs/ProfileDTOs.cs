// thêm mới 30/10
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ProfileResponse
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }

        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }

        public string? Profession { get; set; }
        public string? Organization { get; set; }
        public string? WorkPhone { get; set; }
        public string? WorkEmail { get; set; }
    }

    public class ProfileUpdateRequest
    {
        public string FullName { get; set; } = "";
        [EmailAddress] public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Profession { get; set; }
        public string? Organization { get; set; }
        public string? WorkPhone { get; set; }
        public string? WorkEmail { get; set; }
    }
}
