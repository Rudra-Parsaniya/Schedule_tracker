using Hangfire;
using Microsoft.EntityFrameworkCore;
using schedule_tracker.Data;
using schedule_tracker.DTOs;
using schedule_tracker.Models;

namespace schedule_tracker.Services
{
    public class ReminderService : IReminderService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public ReminderService(AppDbContext context, IEmailService emailService, IBackgroundJobClient backgroundJobClient)
        {
            _context = context;
            _emailService = emailService;
            _backgroundJobClient = backgroundJobClient;
        }

        public async Task<IEnumerable<ReminderDto>> GetRemindersAsync(int userId)
        {
            return await _context.Reminders
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.ReminderDateTime)
                .Select(r => new ReminderDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    ReminderDateTime = r.ReminderDateTime,
                    IsSent = r.IsSent
                })
                .ToListAsync();
        }

        public async Task<ReminderDto> CreateReminderAsync(int userId, ReminderDto reminderDto)
        {
            var reminder = new Reminder
            {
                UserId = userId,
                Title = reminderDto.Title,
                Description = reminderDto.Description,
                ReminderDateTime = reminderDto.ReminderDateTime,
                IsSent = false
            };

            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();

            // Schedule Hangfire Job
            var delay = reminder.ReminderDateTime - DateTime.UtcNow;
            if (delay < TimeSpan.Zero) delay = TimeSpan.Zero;

            _backgroundJobClient.Schedule<IReminderService>(
                x => x.SendReminderEmailJobAsync(reminder.Id),
                delay);

            reminderDto.Id = reminder.Id;
            return reminderDto;
        }

        public async Task<bool> DeleteReminderAsync(int userId, int id)
        {
            var reminder = await _context.Reminders.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (reminder == null) return false;

            _context.Reminders.Remove(reminder);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SendReminderEmailJobAsync(int reminderId)
        {
            var reminder = await _context.Reminders
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == reminderId);

            if (reminder == null || reminder.IsSent || reminder.User == null) return;

            string body = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                    <h2 style='color: #007bff;'>Reminder: {reminder.Title}</h2>
                    <p style='font-size: 16px; color: #333;'>{reminder.Description}</p>
                    <hr />
                    <p style='font-size: 12px; color: #777;'>Scheduled for: {reminder.ReminderDateTime:f}</p>
                </div>";

            await _emailService.SendEmailAsync(reminder.User.Email, $"Reminder: {reminder.Title}", body);

            reminder.IsSent = true;
            await _context.SaveChangesAsync();
        }
    }
}
