using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
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
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new
                        {
                            Field = x.Key,
                            Errors = x.Value?.Errors.Select(e => e.ErrorMessage)
                        })
                });
            }

            try
            {
                var q = await _service.CreateAsync(req);
                return Ok(q);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Query] Error creating query: {ex.Message}");
                return StatusCode(500, new { message = "Failed to submit contact message", error = ex.Message });
            }
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
