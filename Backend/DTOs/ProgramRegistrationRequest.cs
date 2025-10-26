using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ProgramRegistrationRequest
    {
        public int ProgramId { get; set; }
        public int? UserId { get; set; } // optional
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Note { get; set; }
    }
}
