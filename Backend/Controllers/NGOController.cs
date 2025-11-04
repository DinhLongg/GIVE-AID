using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NGOController : ControllerBase
    {
        private readonly NGOService _service;
        public NGOController(NGOService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includePrograms = false) 
            => Ok(await _service.GetAllAsync(includePrograms));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, [FromQuery] bool includePrograms = false)
        {
            var n = await _service.GetByIdAsync(id, includePrograms);
            if (n == null) return NotFound();
            return Ok(n);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NGO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(model);
            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NGO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ok = await _service.UpdateAsync(id, model);
            if (!ok) return NotFound(new { message = "NGO not found" });
            return Ok(new { message = "NGO updated successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result.success) 
                return BadRequest(new { message = result.message });
            return Ok(new { message = result.message });
        }
    }
}
