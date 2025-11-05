//31/10
using System.ComponentModel.DataAnnotations;
namespace Backend.DTOs
{
    public class DonationDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Cause is required")]
        [MaxLength(150)]
        public string Cause { get; set; } = string.Empty;

        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        public int? UserId { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Card";

        public bool Anonymous { get; set; }
        public bool Newsletter { get; set; }
    }
}
