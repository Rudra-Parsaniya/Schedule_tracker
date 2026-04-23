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
    public class TasksController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public TasksController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpPost("complete")]
        public async Task<IActionResult> Complete(TaskCompleteDto completeDto)
        {
            var userId = GetUserId();
            var result = await _scheduleService.CompleteTaskAsync(userId, completeDto.TemplateId);
            
            if (!result)
                return NotFound(new { message = "Task not found or unauthorized" });

            return Ok(new { message = "Task marked as completed" });
        }
    }
}
