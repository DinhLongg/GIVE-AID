//24/10
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AboutController : ControllerBase
    {
        private readonly AboutService _service;
        public AboutController(AboutService service) { _service = service; }

        [HttpGet("{key}")]
        public async Task<IActionResult> Get(string key)
        {
            var section = await _service.GetByKeyAsync(key);
            // Return null if section doesn't exist (not an error, just no content yet)
            return Ok(section);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AboutSection model) => Ok(await _service.CreateAsync(model));

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AboutSection model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ok = await _service.UpdateAsync(id, model);
            if (!ok) return NotFound(new { message = "About section not found" });
            return Ok(new { message = "About section updated successfully" });
        }
    }
}
