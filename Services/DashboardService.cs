using Microsoft.EntityFrameworkCore;
using schedule_tracker.Data;
using schedule_tracker.DTOs;
using System.Linq;

namespace schedule_tracker.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetStatsAsync(int userId)
        {
            var today = DateTime.UtcNow.Date;
            var templatesCount = await _context.ScheduleTemplates.CountAsync(t => t.UserId == userId);
            
            var totalCompleted = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId) && c.IsCompleted)
                .CountAsync();

            var todayCompletions = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId) && c.Date == today && c.IsCompleted)
                .CountAsync();

            double dailyCompletionPercentage = templatesCount > 0 ? (double)todayCompletions / templatesCount * 100 : 0;

            // Calculate Streak
            int streak = 0;
            var pastCompletions = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId) && c.IsCompleted)
                .GroupBy(c => c.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Date)
                .ToListAsync();

            DateTime checkDate = today;
            // If today is not fully completed yet, streak might still be active based on yesterday
            bool todayIsFull = pastCompletions.Any(g => g.Date == today && g.Count == templatesCount);
            
            if (!todayIsFull)
            {
                checkDate = today.AddDays(-1);
            }

            foreach (var record in pastCompletions.Where(r => r.Date <= checkDate))
            {
                if (record.Date == checkDate && record.Count == templatesCount)
                {
                    streak++;
                    checkDate = checkDate.AddDays(-1);
                }
                else
                {
                    break;
                }
            }

            // Consistency Score (Last 30 days completion average)
            var thirtyDaysAgo = today.AddDays(-30);
            var last30DaysRecords = pastCompletions.Where(r => r.Date >= thirtyDaysAgo && r.Date < today).ToList();
            double consistencyScore = templatesCount > 0 ? (double)last30DaysRecords.Sum(r => r.Count) / (templatesCount * 30) * 100 : 0;

            // Graph Data
            var weeklyGraph = new List<GraphDataPoint>();
            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                var record = pastCompletions.FirstOrDefault(r => r.Date == date);
                weeklyGraph.Add(new GraphDataPoint
                {
                    Label = date.ToString("ddd"),
                    Value = templatesCount > 0 ? (double)(record?.Count ?? 0) / templatesCount * 100 : 0
                });
            }

            var monthlyGraph = new List<GraphDataPoint>();
            for (int i = 29; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                var record = pastCompletions.FirstOrDefault(r => r.Date == date);
                monthlyGraph.Add(new GraphDataPoint
                {
                    Label = date.ToString("MM/dd"),
                    Value = templatesCount > 0 ? (double)(record?.Count ?? 0) / templatesCount * 100 : 0
                });
            }

            return new DashboardStatsDto
            {
                DailyCompletionPercentage = Math.Round(dailyCompletionPercentage, 2),
                TotalCompletedTasks = totalCompleted,
                Streak = streak,
                ConsistencyScore = Math.Round(consistencyScore, 2),
                WeeklyGraph = weeklyGraph,
                MonthlyGraph = monthlyGraph
            };
        }
    }
}
