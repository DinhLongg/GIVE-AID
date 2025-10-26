using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryService _service;
        public GalleryController(GalleryService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Gallery g) => Ok(await _service.CreateAsync(g));

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _service.DeleteAsync(id)) return NotFound();
            return Ok();
        }
    }
}
