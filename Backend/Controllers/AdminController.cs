//28/10
using Backend.Services;
using Backend.Helpers;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly DonationService _donationService;
        private readonly QueryService _queryService;
        private readonly EmailService _emailService;

        public AdminController(
            UserService userService,
            DonationService donationService,
            QueryService queryService,
            EmailService emailService)
        {
            _userService = userService;
            _donationService = donationService;
            _queryService = queryService;
            _emailService = emailService;
        }

        // --- Users management ---

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("users/{id:int}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        public class UpdateRoleRequest
        {
            public string Role { get; set; } = "User";
        }

        [HttpPut("users/{id:int}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Role)) return BadRequest(new { message = "Role is required" });

            var ok = await _userService.UpdateRoleAsync(id, req.Role);
            if (!ok) return NotFound(new { message = "User not found" });

            return Ok(new { message = "Role updated" });
        }

        [HttpDelete("users/{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var ok = await _userService.DeleteAsync(id);
            if (!ok) return NotFound(new { message = "User not found" });
            return Ok(new { message = "User deleted" });
        }

        // --- Donations ---

        [HttpGet("donations")]
        public async Task<IActionResult> GetAllDonations(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var result = await _donationService.GetAdminPagedAsync(page, pageSize, search, status);
                return Ok(new
                {
                    items = result.Data.Items,
                    page = result.Data.Page,
                    pageSize = result.Data.PageSize,
                    totalItems = result.Data.TotalItems,
                    totalPages = result.Data.TotalPages,
                    summary = result.Summary
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AdminController] Error getting donations: {ex.Message}");
                Console.WriteLine($"[AdminController] StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[AdminController] Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "Failed to retrieve donations", error = ex.Message });
            }
        }

        [HttpGet("donations/{id:int}")]
        public async Task<IActionResult> GetDonation(int id)
        {
            var d = await _donationService.GetByIdAsync(id);
            if (d == null) return NotFound();
            return Ok(d);
        }

        // --- Queries (Help Centre) ---

        [HttpGet("queries")]
        public async Task<IActionResult> GetAllQueries()
        {
            var list = await _queryService.GetAllAsync();
            return Ok(list);
        }

        public class ReplyRequest
        {
            public string Reply { get; set; } = string.Empty;
        }

        [HttpPost("queries/{id:int}/reply")]
        public async Task<IActionResult> ReplyQuery(int id, [FromBody] ReplyRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Reply)) return BadRequest(new { message = "Reply is required" });

            var ok = await _queryService.ReplyAsync(id, req.Reply);
            if (!ok) return NotFound(new { message = "Query not found" });

            // optionally email the user if email exists
            var query = await _queryService.GetByIdAsync(id);
            if (query != null && query.User != null && !string.IsNullOrEmpty(query.User.Email))
            {
                var body = EmailTemplate.QueryReplyTemplate(query.Subject, req.Reply, query.User.FullName ?? query.User.Email);
                await _emailService.SendEmailAsync(query.User.Email, $"Reply to your query: {query.Subject}", body);
            }

            return Ok(new { message = "Replied" });
        }
    }
}
