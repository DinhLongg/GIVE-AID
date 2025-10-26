using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Donation
    {
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required, MaxLength(150)]
        public string? CauseName { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Card (Dummy)";

        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? UserId { get; set; }
        public User? User { get; set; }

        public string? TransactionReference { get; set; }
    }
}
