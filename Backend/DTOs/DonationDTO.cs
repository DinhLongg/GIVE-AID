//31/10
using System.ComponentModel.DataAnnotations;
namespace Backend.DTOs
{
    public class DonationDTO
    {
        public decimal Amount { get; set; }
        public string Cause { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public int? UserId { get; set; }

        public string PaymentMethod { get; set; } = "Card";
        //public string CardNumber { get; set; } = string.Empty;
        //public string Expiry { get; set; } = string.Empty;
        //public string CVV { get; set; } = string.Empty;

        public bool Anonymous { get; set; }
        public bool Newsletter { get; set; }
    }
}
