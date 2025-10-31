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
    }

    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required, MinLength(6)]
        public string NewPassword { get; set; } = "";

        [Required]
        public string ConfirmPassword { get; set; } = "";
    }
}
