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
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
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
            var schedules = await _scheduleService.GetSchedulesByUserIdAsync(userId);
            return Ok(schedules);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            var userId = GetUserId();
            var schedules = await _scheduleService.GetTodayScheduleAsync(userId);
            return Ok(schedules);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ScheduleDto scheduleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _scheduleService.AddScheduleAsync(userId, scheduleDto);
            if (result == null)
                return BadRequest(new { message = "Invalid time format. Use HH:mm" });

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ScheduleDto scheduleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _scheduleService.UpdateScheduleAsync(userId, id, scheduleDto);
            if (!result)
                return NotFound(new { message = "Schedule not found or unauthorized" });

            return Ok(new { message = "Schedule updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var result = await _scheduleService.DeleteScheduleAsync(userId, id);
            if (!result)
                return NotFound(new { message = "Schedule not found or unauthorized" });

            return Ok(new { message = "Schedule deleted successfully" });
        }
    }
}
