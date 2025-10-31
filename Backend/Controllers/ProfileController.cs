using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;
        private readonly AuthService _authService;

        public ProfileController(ProfileService profileService, AuthService authService)
        {
            _profileService = profileService;
            _authService = authService;
        }

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var profile = await _profileService.GetProfileAsync(userId);
            // Return empty profile if not found (frontend will handle it)
            if (profile == null)
            {
                return Ok(null);
            }

            return Ok(profile);
        }

        /// <summary>
        /// Update current user's profile
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var success = await _profileService.UpdateProfileAsync(userId, request);
            if (!success)
            {
                return BadRequest(new { message = "Failed to update profile" });
            }

            return Ok(new { message = "Profile updated successfully" });
        }

        /// <summary>
        /// Change password for current user
        /// </summary>
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var result = await _authService.ChangePasswordAsync(userId, request);
            if (!result.success)
            {
                return BadRequest(new { message = result.message });
            }

            return Ok(new { message = result.message });
        }
    }
}

