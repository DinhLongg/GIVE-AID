using Give_AID.API.Models;
using Give_AID.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Give_AID.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NGOController : ControllerBase
    {
        private readonly NGOService _service;
        public NGOController(NGOService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var n = await _service.GetByIdAsync(id);
            if (n == null) return NotFound();
            return Ok(n);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NGO model)
        {
            var created = await _service.CreateAsync(model);
            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NGO model)
        {
            var ok = await _service.UpdateAsync(id, model);
            if (!ok) return NotFound();
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
