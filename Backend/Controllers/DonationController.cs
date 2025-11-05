using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
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
        public async Task<IActionResult> Create([FromBody] DonationDTO dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .Select(x => new { Field = x.Key, Errors = x.Value?.Errors.Select(e => e.ErrorMessage) });
                return BadRequest(new { message = "Validation failed", errors });
            }
            
            // Validate required fields manually
            if (dto.Amount <= 0)
                return BadRequest(new { message = "Amount must be greater than 0" });
            
            if (string.IsNullOrWhiteSpace(dto.Cause))
                return BadRequest(new { message = "Cause is required" });
            
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest(new { message = "Full name is required" });
            
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Email is required" });

            try
            {
                var donation = await _donationService.CreateAsync(dto);
                return Ok(donation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create donation", error = ex.Message });
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
