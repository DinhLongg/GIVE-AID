using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Gallery
    {
        public int Id { get; set; }

        [Required]
        public string? ImageUrl { get; set; }

        public string? Caption { get; set; }

        public int? ProgramId { get; set; }
        public NgoProgram? Program { get; set; }
    }
}
