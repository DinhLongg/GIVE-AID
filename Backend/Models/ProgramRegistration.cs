using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ProgramRegistration
    {
        public int Id { get; set; }

        public int ProgramId { get; set; }
        public NgoProgram? Program { get; set; }

        [Required, MaxLength(120)]
        public string? FullName { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        public string? Phone { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
