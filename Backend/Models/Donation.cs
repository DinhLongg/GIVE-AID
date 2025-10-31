using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Donation
    {
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required, MaxLength(150)]
        public string CauseName { get; set; } = string.Empty;

        // Personal Info
        [MaxLength(150)]
        public string DonorName { get; set; } = string.Empty;

        [EmailAddress, MaxLength(150)]
        public string DonorEmail { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? DonorPhone { get; set; }

        [MaxLength(250)]
        public string? DonorAddress { get; set; }

        // Payment
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Card";

        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        [MaxLength(200)]
        public string? TransactionReference { get; set; }

        // Options
        public bool IsAnonymous { get; set; }
        public bool SubscribeNewsletter { get; set; }

        // Relationship (optional)
        public int? UserId { get; set; }
        public User? User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
