using Give_AID.API.DTOs;
using Give_AID.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Give_AID.API.Controllers
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
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var donation = await _donationService.CreateAsync(dto);
            if (donation == null) return BadRequest(new { message = "Payment validation failed" });
            return Ok(donation);
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
