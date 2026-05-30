using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface ICalendarService
    {
        Task<List<MonthlyCalendarDayDto>> GetMonthlyCalendarAsync(int userId, int month, int year);
        Task<CalendarDayDetailDto> GetDayDetailsAsync(int userId, DateTime date);
    }
}
