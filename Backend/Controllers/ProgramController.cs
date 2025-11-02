using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramController : ControllerBase
    {
        private readonly ProgramService _programService;

        public ProgramController(ProgramService programService)
        {
            _programService = programService;
        }

        /// <summary>Get all programs</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _programService.GetAllAsync();
            return Ok(result);
        }

        /// <summary>Get program by ID</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _programService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        /// <summary>Register interest in program</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ProgramRegistrationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _programService.RegisterAsync(request);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new { message = result.message });
        }
    }
}
