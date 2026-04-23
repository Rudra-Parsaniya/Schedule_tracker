using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using schedule_tracker.DTOs;
using schedule_tracker.Services;
using System.Security.Claims;

namespace schedule_tracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RemindersController : ControllerBase
    {
        private readonly IReminderService _reminderService;

        public RemindersController(IReminderService reminderService)
        {
            _reminderService = reminderService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var reminders = await _reminderService.GetRemindersAsync(userId);
            return Ok(reminders);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ReminderDto reminderDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _reminderService.CreateReminderAsync(userId, reminderDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var result = await _reminderService.DeleteReminderAsync(userId, id);
            if (!result)
                return NotFound(new { message = "Reminder not found or unauthorized" });

            return Ok(new { message = "Reminder deleted successfully" });
        }
    }
}
