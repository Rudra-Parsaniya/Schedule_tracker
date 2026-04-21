using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface IScheduleService
    {
        Task<IEnumerable<ScheduleDto>> GetSchedulesByUserIdAsync(int userId);
        Task<ScheduleDto?> AddScheduleAsync(int userId, ScheduleDto scheduleDto);
        Task<bool> UpdateScheduleAsync(int userId, int id, ScheduleDto scheduleDto);
        Task<bool> DeleteScheduleAsync(int userId, int id);
    }
}
