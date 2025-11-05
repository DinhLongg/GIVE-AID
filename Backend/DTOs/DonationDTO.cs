//31/10
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Backend.DTOs
{
    public class DonationDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Cause is required")]
        [MaxLength(150)]
        [JsonPropertyName("cause")]
        public string Cause { get; set; } = string.Empty;

        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(150)]
        [JsonPropertyName("fullName")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(150)]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [MaxLength(250)]
        [JsonPropertyName("address")]
        public string? Address { get; set; }

        [JsonPropertyName("userId")]
        public int? UserId { get; set; }

        [JsonPropertyName("programId")]
        public int? ProgramId { get; set; } // Link to specific program

        [MaxLength(50)]
        [JsonPropertyName("paymentMethod")]
        public string PaymentMethod { get; set; } = "Card";

        [JsonPropertyName("anonymous")]
        public bool Anonymous { get; set; }

        [JsonPropertyName("newsletter")]
        public bool Newsletter { get; set; }
    }
}
