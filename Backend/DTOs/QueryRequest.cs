using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.DTOs
{
    public class QueryRequest
    {
        public int? UserId { get; set; } // optional
        [Required]
        public string? Subject { get; set; }
        [Required]
        public string? Message { get; set; }
    }
}
