using Backend.Services;
using Backend.Helpers;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetAllDonations()
        {
            var list = await _donationService.GetAllAsync();
            return Ok(list);
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
