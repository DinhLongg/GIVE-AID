using Give_AID.API.Models;
using Give_AID.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Give_AID.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartnerController : ControllerBase
    {
        private readonly PartnerService _service;
        public PartnerController(PartnerService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Partner p) => Ok(await _service.CreateAsync(p));

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Partner p)
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
