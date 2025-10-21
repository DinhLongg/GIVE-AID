using Give_AID.API.Models;
using Give_AID.API.Services;
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
            if (section == null) return NotFound();
            return Ok(section);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(AboutSection model) => Ok(await _service.CreateAsync(model));

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, AboutSection model)
        {
            var ok = await _service.UpdateAsync(id, model);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
