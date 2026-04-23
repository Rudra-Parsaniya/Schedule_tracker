using Microsoft.EntityFrameworkCore;
using schedule_tracker.Data;
using schedule_tracker.DTOs;
using schedule_tracker.Models;

namespace schedule_tracker.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly AppDbContext _context;

        public ScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ScheduleDto>> GetSchedulesByUserIdAsync(int userId)
        {
            return await _context.ScheduleTemplates
                .Where(s => s.UserId == userId)
                .Select(s => new ScheduleDto
                {
                    Id = s.Id,
                    TaskName = s.TaskName,
                    Time = s.Time.ToString(@"hh\:mm")
                })
                .ToListAsync();
        }

        public async Task<ScheduleDto?> AddScheduleAsync(int userId, ScheduleDto scheduleDto)
        {
            if (!TimeSpan.TryParse(scheduleDto.Time, out var time))
                return null;

            var schedule = new ScheduleTemplate
            {
                UserId = userId,
                TaskName = scheduleDto.TaskName,
                Time = time
            };

            _context.ScheduleTemplates.Add(schedule);
            await _context.SaveChangesAsync();

            scheduleDto.Id = schedule.Id;
            return scheduleDto;
        }

        public async Task<bool> UpdateScheduleAsync(int userId, int id, ScheduleDto scheduleDto)
        {
            var schedule = await _context.ScheduleTemplates
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (schedule == null) return false;
            if (!TimeSpan.TryParse(scheduleDto.Time, out var time)) return false;

            schedule.TaskName = scheduleDto.TaskName;
            schedule.Time = time;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteScheduleAsync(int userId, int id)
        {
            var schedule = await _context.ScheduleTemplates
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (schedule == null) return false;

            _context.ScheduleTemplates.Remove(schedule);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ScheduleTodayDto>> GetTodayScheduleAsync(int userId)
        {
            var today = DateTime.UtcNow.Date;
            var templates = await _context.ScheduleTemplates
                .Where(s => s.UserId == userId)
                .ToListAsync();

            var completions = await _context.TaskCompletions
                .Where(c => templates.Select(t => t.Id).Contains(c.TemplateId) && c.Date == today)
                .ToListAsync();

            return templates.Select(t => new ScheduleTodayDto
            {
                Id = t.Id,
                TaskName = t.TaskName,
                Time = t.Time.ToString(@"hh\:mm"),
                IsCompleted = completions.Any(c => c.TemplateId == t.Id && c.IsCompleted)
            });
        }

        public async Task<bool> CompleteTaskAsync(int userId, int templateId)
        {
            var today = DateTime.UtcNow.Date;
            
            // Ensure the template belongs to the user
            var template = await _context.ScheduleTemplates
                .FirstOrDefaultAsync(t => t.Id == templateId && t.UserId == userId);
            
            if (template == null) return false;

            // Check if already completed today
            var existing = await _context.TaskCompletions
                .FirstOrDefaultAsync(c => c.TemplateId == templateId && c.Date == today);

            if (existing != null)
            {
                if (existing.IsCompleted) return true; // Already done
                existing.IsCompleted = true;
            }
            else
            {
                var completion = new TaskCompletion
                {
                    TemplateId = templateId,
                    Date = today,
                    IsCompleted = true
                };
                _context.TaskCompletions.Add(completion);
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
