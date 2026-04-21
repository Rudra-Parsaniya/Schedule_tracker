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
    }
}
