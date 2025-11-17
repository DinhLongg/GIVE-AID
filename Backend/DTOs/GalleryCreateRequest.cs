using Microsoft.AspNetCore.Http;

namespace Backend.DTOs
{
    public class GalleryCreateRequest
    {
        public IFormFile? File { get; set; }
        public string? ImageUrl { get; set; }
        public string? Caption { get; set; }
        public int? ProgramId { get; set; }
    }
}

