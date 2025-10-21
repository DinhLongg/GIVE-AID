using System;
using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.Models
{
    public class Invitation
    {
        public int Id { get; set; }

        public int FromUserId { get; set; }
        public User? FromUser { get; set; }

        [Required, EmailAddress]
        public string? ToEmail { get; set; }

        public string? Message { get; set; }

        public string? Token { get; set; }  // For tracking
        public string Status { get; set; } = "Sent";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
