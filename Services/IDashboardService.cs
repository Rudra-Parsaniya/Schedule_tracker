using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync(int userId);
    }
}
