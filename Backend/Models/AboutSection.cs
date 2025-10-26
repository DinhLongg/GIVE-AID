using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AboutSection
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string? Key { get; set; }   // e.g., "mission", "whatwedo", "ourteam"

        public string? Title { get; set; }

        public string? Content { get; set; }

        public string? ExtraJson { get; set; }  // optional metadata
    }
}
