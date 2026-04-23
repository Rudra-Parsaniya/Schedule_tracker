using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface IReminderService
    {
        Task<IEnumerable<ReminderDto>> GetRemindersAsync(int userId);
        Task<ReminderDto> CreateReminderAsync(int userId, ReminderDto reminderDto);
        Task<bool> DeleteReminderAsync(int userId, int id);
        Task SendReminderEmailJobAsync(int reminderId);
    }
}
