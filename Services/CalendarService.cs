using Microsoft.EntityFrameworkCore;
using schedule_tracker.Data;
using schedule_tracker.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace schedule_tracker.Services
{
    public class CalendarService : ICalendarService
    {
        private readonly AppDbContext _context;

        public CalendarService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MonthlyCalendarDayDto>> GetMonthlyCalendarAsync(int userId, int month, int year)
        {
            var templatesCount = await _context.ScheduleTemplates.CountAsync(t => t.UserId == userId);
            
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var result = new List<MonthlyCalendarDayDto>();
            
            var startDate = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = startDate.AddMonths(1).AddTicks(-1);

            var completionsInMonth = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId))
                .Where(c => c.Date >= startDate && c.Date <= endDate)
                .ToListAsync();

            for (int i = 1; i <= daysInMonth; i++)
            {
                var currentDate = new DateTime(year, month, i, 0, 0, 0, DateTimeKind.Utc);
                
                var completionsForDay = completionsInMonth
                    .Where(c => c.Date.Date == currentDate.Date && c.IsCompleted)
                    .Count();

                double percentage = templatesCount > 0 ? ((double)completionsForDay / templatesCount) * 100 : 0;
                
                result.Add(new MonthlyCalendarDayDto
                {
                    Date = currentDate,
                    TotalTasks = templatesCount,
                    CompletedTasks = completionsForDay,
                    CompletionPercentage = Math.Round(percentage, 2),
                    IsFullyCompleted = templatesCount > 0 && completionsForDay == templatesCount
                });
            }

            return result;
        }

        public async Task<CalendarDayDetailDto> GetDayDetailsAsync(int userId, DateTime date)
        {
            var dateUtc = date.Date;
            
            var templates = await _context.ScheduleTemplates
                .Where(t => t.UserId == userId)
                .ToListAsync();
                
            var completions = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId))
                .Where(c => c.Date.Date == dateUtc)
                .ToListAsync();

            var taskDetails = templates.Select(t => new TaskDetailDto
            {
                TaskName = t.TaskName,
                Time = t.Time,
                IsCompleted = completions.Any(c => c.TemplateId == t.Id && c.IsCompleted)
            })
            .OrderBy(t => t.Time)
            .ToList();

            return new CalendarDayDetailDto
            {
                Date = dateUtc,
                Tasks = taskDetails
            };
        }
    }
}
