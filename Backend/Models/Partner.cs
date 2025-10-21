using System.ComponentModel.DataAnnotations;

namespace Give_AID.API.Models
{
    public class Partner
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string? Name { get; set; }

        public string? LogoUrl { get; set; }

        public string?   Website { get; set; }
    }
}
