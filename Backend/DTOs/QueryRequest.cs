using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class QueryRequest
    {
        public int? UserId { get; set; } // optional
        [Required]
        [MaxLength(200, ErrorMessage = "Subject cannot exceed 200 characters.")]
        public string? Subject { get; set; }
        [Required]
        public string? Message { get; set; }
        public string? Email { get; set; } // For sending confirmation email
        public string? FullName { get; set; } // For personalization
    }
}
