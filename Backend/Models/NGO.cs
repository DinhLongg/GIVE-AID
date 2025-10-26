using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class NGO
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? LogoUrl { get; set; }

        public string? Website { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<NgoProgram>? NgoPrograms { get; set; }
    }
}
