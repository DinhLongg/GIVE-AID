using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.Models
{
    public class Cause
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string? Name { get; set; }   // e.g., Children, Education, Health

        public string? Description { get; set; }
    }
}
