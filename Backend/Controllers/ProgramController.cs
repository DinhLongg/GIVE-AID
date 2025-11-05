using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

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

        /// <summary>Get program donation statistics</summary>
        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetStats(int id)
        {
            var program = await _programService.GetByIdAsync(id);
            if (program == null) return NotFound();

            var totalDonations = await _programService.GetTotalDonationsAsync(id);
            var progressPercentage = await _programService.GetProgressPercentageAsync(id);

            return Ok(new
            {
                programId = id,
                goalAmount = program.GoalAmount,
                totalDonations = totalDonations,
                progressPercentage = progressPercentage,
                remainingAmount = program.GoalAmount.HasValue 
                    ? Math.Max(0, program.GoalAmount.Value - totalDonations) 
                    : (decimal?)null
            });
        }

        /// <summary>Create a new program (Admin only)</summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NgoProgram model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _programService.CreateAsync(model);
            return Ok(result);
        }

        /// <summary>Update a program (Admin only)</summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NgoProgram model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ok = await _programService.UpdateAsync(id, model);
            if (!ok) return NotFound(new { message = "Program not found" });
            return Ok(new { message = "Program updated successfully" });
        }

        /// <summary>Delete a program (Admin only)</summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _programService.DeleteAsync(id);
            if (!ok) return NotFound(new { message = "Program not found" });
            return Ok(new { message = "Program deleted successfully" });
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
