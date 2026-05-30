using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using schedule_tracker.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace schedule_tracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthly(int month, int year)
        {
            if (month < 1 || month > 12 || year < 2000 || year > 2100)
            {
                return BadRequest("Invalid month or year");
            }

            var userId = GetUserId();
            var data = await _calendarService.GetMonthlyCalendarAsync(userId, month, year);
            return Ok(data);
        }

        [HttpGet("day/{date}")]
        public async Task<IActionResult> GetDayDetails(DateTime date)
        {
            var userId = GetUserId();
            var data = await _calendarService.GetDayDetailsAsync(userId, date);
            return Ok(data);
        }
    }
}
