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
                Time = time,
                Category = scheduleDto.Category,
                Priority = scheduleDto.Priority
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
            schedule.Category = scheduleDto.Category;
            schedule.Priority = scheduleDto.Priority;

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
            return await GetSchedulesAsync(userId, null, null, null, null, DateTime.UtcNow.Date, null);
        }

        public async Task<IEnumerable<ScheduleTodayDto>> GetSchedulesAsync(int userId, string? search, string? category, string? priority, bool? completed, DateTime? date, string? sortBy)
        {
            var targetDate = date ?? DateTime.UtcNow.Date;
            
            var query = _context.ScheduleTemplates.Where(s => s.UserId == userId).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(s => s.TaskName.Contains(search));

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(s => s.Category == category);

            if (!string.IsNullOrWhiteSpace(priority))
                query = query.Where(s => s.Priority == priority);

            var templates = await query.ToListAsync();

            var completions = await _context.TaskCompletions
                .Where(c => templates.Select(t => t.Id).Contains(c.TemplateId) && c.Date == targetDate)
                .ToListAsync();

            var result = templates.Select(t => new ScheduleTodayDto
            {
                Id = t.Id,
                TaskName = t.TaskName,
                Time = t.Time.ToString(@"hh\:mm"),
                Category = t.Category,
                Priority = t.Priority,
                IsCompleted = completions.Any(c => c.TemplateId == t.Id && c.IsCompleted)
            }).AsEnumerable();

            if (completed.HasValue)
            {
                result = result.Where(r => r.IsCompleted == completed.Value);
            }

            result = sortBy switch
            {
                "time_desc" => result.OrderByDescending(r => TimeSpan.Parse(r.Time)),
                "priority" => result.OrderByDescending(r => r.Priority == "High" ? 3 : r.Priority == "Medium" ? 2 : 1),
                "created" => result.OrderByDescending(r => r.Id),
                _ => result.OrderBy(r => TimeSpan.Parse(r.Time)) // default time_asc
            };

            return result;
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
