using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class QueryRequest
    {
        public int? UserId { get; set; } // optional
        [Required]
        public string? Subject { get; set; }
        [Required]
        public string? Message { get; set; }
        public string? Email { get; set; } // For sending confirmation email
        public string? FullName { get; set; } // For personalization
    }
}
