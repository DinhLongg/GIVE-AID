using Give_AID.API.Models;
using Give_AID.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Give_AID.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramController : ControllerBase
    {
        private readonly ProgramService _service;
        public ProgramController(ProgramService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id) => Ok(await _service.GetByIdAsync(id));

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(NgoProgram p) => Ok(await _service.CreateAsync(p));

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, NgoProgram p)
        {
            if (!await _service.UpdateAsync(id, p)) return NotFound();
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _service.DeleteAsync(id)) return NotFound();
            return Ok();
        }
    }
}
