using Give_AID.API.DTOs;
using Give_AID.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Give_AID.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QueryController : ControllerBase
    {
        private readonly QueryService _service;
        public QueryController(QueryService service) { _service = service; }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QueryRequest req)
        {
            var q = await _service.CreateAsync(req);
            return Ok(q);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [Authorize(Roles = "Admin")]
        [HttpPost("{id:int}/reply")]
        public async Task<IActionResult> Reply(int id, [FromBody] string reply)
        {
            var ok = await _service.ReplyAsync(id, reply);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
