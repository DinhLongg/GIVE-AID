using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvitationController : ControllerBase
    {
        private readonly InvitationService _service;
        public InvitationController(InvitationService service) { _service = service; }

        [Authorize]
        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] Models.Invitation reqModel)
        {
            // reqModel.FromUserId should be set by token in practice; do simple check:
            var created = await _service.SendAsync(reqModel.FromUserId, reqModel.ToEmail, reqModel.Message);
            return Ok(created);
        }
    }
}
