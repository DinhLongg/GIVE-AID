using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Query
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        [Required, MaxLength(200)]
        public string? Subject { get; set; }

        [Required]
        public string? Message { get; set; }

        public string? AdminReply { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RepliedAt { get; set; }
    }
}
