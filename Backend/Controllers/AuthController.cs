using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng ký tài khoản mới (trả về JWT token nếu thành công)
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // AuthService sẽ trả về (bool success, string message, string? token)
            var result = await _authService.RegisterAsync(request);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new
            {
                message = result.message,
                token = result.token
            });
        }

        /// <summary>
        /// Đăng nhập (trả về JWT token nếu thành công)
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new
            {
                message = result.message,
                token = result.token
            });
        }
    }
}
