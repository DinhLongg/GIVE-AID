using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.DTOs
{
    public class DonationDTO
    {
        public int? UserId { get; set; }  // can be null for guest
        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string? CauseName { get; set; }

        // Dummy card info for validation
        [Required]
        public string? CardNumber { get; set; }

        [Required]
        public string? CardExpiry { get; set; } // MM/YY

        [Required]
        public string? CardCvv { get; set; }
    }
}
