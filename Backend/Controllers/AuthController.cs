//27/10
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
        public async Task<IActionResult> Register([FromBody] RegisterRequest? request)
        {
            if (request == null)
            {
                Console.WriteLine("[Error] Register request is null");
                return BadRequest(new { message = "Request body is required" });
            }

            // Log incoming request for debugging
            Console.WriteLine($"[Debug] Register request - FullName: '{request.FullName}', Username: '{request.Username}', Email: '{request.Email}'");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => new { Field = x.Key, Message = e.ErrorMessage }))
                    .ToList();
                
                Console.WriteLine($"[Error] Validation failed: {string.Join(", ", errors.Select(e => $"{e.Field}: {e.Message}"))}");
                return BadRequest(new { message = "Validation failed", errors });
            }

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
        public async Task<IActionResult> Login([FromBody] LoginRequest? request)
        {
            if (request == null)
            {
                Console.WriteLine("[Error] Login request is null");
                return BadRequest(new { message = "Request body is required" });
            }

            // Log incoming request for debugging
            Console.WriteLine($"[Debug] Login request - UsernameOrEmail: '{request.UsernameOrEmail}'");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => new { Field = x.Key, Message = e.ErrorMessage }))
                    .ToList();
                
                Console.WriteLine($"[Error] Validation failed: {string.Join(", ", errors.Select(e => $"{e.Field}: {e.Message}"))}");
                return BadRequest(new { message = "Validation failed", errors });
            }

            var result = await _authService.LoginAsync(request);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new
            {
                message = result.message,
                token = result.token
            });
        }

        /// <summary>
        /// Verify email address with token
        /// </summary>
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest? request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Token))
            {
                Console.WriteLine("[Error] VerifyEmail request is null or token is empty");
                return BadRequest(new { message = "Token is required" });
            }

            Console.WriteLine($"[Debug] VerifyEmail endpoint - Token received: '{request.Token}'");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => new { Field = x.Key, Message = e.ErrorMessage }))
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }

            var result = await _authService.VerifyEmailAsync(request.Token);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new { message = result.message });
        }

        /// <summary>
        /// Resend verification email
        /// </summary>
        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ResendVerificationEmailAsync(request.Email);

            // Always return success (security - don't reveal if email exists)
            return Ok(new { message = result.message });
        }

        /// <summary>
        /// Forgot password - Send password reset email
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest? request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email))
            {
                Console.WriteLine("[Error] ForgotPassword request is null or email is empty");
                return BadRequest(new { message = "Email is required" });
            }

            Console.WriteLine($"[Debug] ForgotPassword endpoint - Email: '{request.Email}'");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => new { Field = x.Key, Message = e.ErrorMessage }))
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }

            var result = await _authService.ForgotPasswordAsync(request.Email);

            // Always return success to prevent email enumeration attacks
            // But backend will still send email if user exists
            return Ok(new { message = result.message });
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest? request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Token))
            {
                Console.WriteLine("[Error] ResetPassword request is null or token is empty");
                return BadRequest(new { message = "Token is required" });
            }

            Console.WriteLine($"[Debug] ResetPassword endpoint - Token received: '{request.Token}'");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors.Select(e => new { Field = x.Key, Message = e.ErrorMessage }))
                    .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }

            var result = await _authService.ResetPasswordAsync(request);

            if (!result.success)
                return BadRequest(new { message = result.message });

            return Ok(new { message = result.message });
        }
    }
}
