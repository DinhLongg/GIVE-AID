using Give_AID.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GiveAid.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string FullName { get; set; }

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [MaxLength(20)]
        public string Role { get; set; } = "User";

        public string Phone { get; set; }

        public string Address { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Donation> Donations { get; set; }
        public ICollection<Invitation> SentInvitations { get; set; }
    }
}
