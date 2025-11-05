using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationController : ControllerBase
    {
        private readonly DonationService _donationService;
        public DonationController(DonationService donationService)
        {
            _donationService = donationService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DonationDTO? dto)
        {
            // Check if DTO is null
            if (dto == null)
            {
                return BadRequest(new { message = "Request body is required" });
            }

            // Log received data for debugging
            Console.WriteLine($"[Donation] Received: Amount={dto.Amount}, Cause={dto.Cause}, FullName={dto.FullName}, Email={dto.Email}, UserId={dto.UserId}");

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) })
                    .ToList();
                
                Console.WriteLine($"[Donation] ModelState validation failed: {string.Join(", ", errors.Select(e => $"{e.Field}: {string.Join(", ", e.Errors)}"))}");
                
                return BadRequest(new { message = "Validation failed", errors });
            }
            
            // Validate required fields manually
            if (dto.Amount <= 0)
            {
                Console.WriteLine($"[Donation] Amount validation failed: {dto.Amount}");
                return BadRequest(new { message = "Amount must be greater than 0" });
            }
            
            if (string.IsNullOrWhiteSpace(dto.Cause))
            {
                Console.WriteLine("[Donation] Cause is empty");
                return BadRequest(new { message = "Cause is required" });
            }
            
            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                Console.WriteLine("[Donation] FullName is empty");
                return BadRequest(new { message = "Full name is required" });
            }
            
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                Console.WriteLine("[Donation] Email is empty");
                return BadRequest(new { message = "Email is required" });
            }

            try
            {
                var donation = await _donationService.CreateAsync(dto);
                Console.WriteLine($"[Donation] Successfully created donation ID: {donation.Id}");
                return Ok(donation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Donation] Exception: {ex.Message}");
                Console.WriteLine($"[Donation] StackTrace: {ex.StackTrace}");
                return BadRequest(new { message = "Failed to create donation", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current user's donation history
        /// Must be placed before {id:int} route to avoid route conflict
        /// </summary>
        [Authorize]
        [HttpGet("my-donations")]
        public async Task<IActionResult> GetMyDonations()
        {
            try
            {
                // Get user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var donations = await _donationService.GetByUserIdAsync(userId);
                return Ok(donations);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DonationController] Error getting user donations: {ex.Message}");
                return StatusCode(500, new { message = "Failed to retrieve donations", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _donationService.GetAllAsync();
            return Ok(list);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var d = await _donationService.GetByIdAsync(id);
            if (d == null) return NotFound();
            return Ok(d);
        }
    }
}
