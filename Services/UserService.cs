using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using schedule_tracker.Data;
using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UserService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            var today = DateTime.UtcNow.Date;
            var templatesCount = await _context.ScheduleTemplates.CountAsync(t => t.UserId == userId);
            
            var totalCompleted = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId) && c.IsCompleted)
                .CountAsync();

            // Calculate Completion Percentage overall (based on all-time completion vs all-time scheduled tasks approx)
            // But for simplicity, we will use total tasks scheduled overall vs total completed
            // Actually, we'll keep it simple: just completed / (templates * days since creation)?
            // Or just reuse the daily completion average from dashboard logic? Let's use totalCompleted / (templatesCount * daysActive)
            var daysActive = (today - user.CreatedAt.Date).Days;
            if (daysActive < 1) daysActive = 1;
            double completionPercentage = (templatesCount * daysActive) > 0 ? (double)totalCompleted / (templatesCount * daysActive) * 100 : 0;
            if (completionPercentage > 100) completionPercentage = 100;

            // Calculate Streak
            int streak = 0;
            var pastCompletions = await _context.TaskCompletions
                .Where(c => _context.ScheduleTemplates.Any(t => t.Id == c.TemplateId && t.UserId == userId) && c.IsCompleted)
                .GroupBy(c => c.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Date)
                .ToListAsync();

            DateTime checkDate = today;
            bool todayIsFull = pastCompletions.Any(g => g.Date == today && g.Count >= templatesCount && templatesCount > 0);
            
            if (!todayIsFull && templatesCount > 0)
            {
                checkDate = today.AddDays(-1);
            }

            foreach (var record in pastCompletions.Where(r => r.Date <= checkDate))
            {
                if (record.Date == checkDate && record.Count >= templatesCount && templatesCount > 0)
                {
                    streak++;
                    checkDate = checkDate.AddDays(-1);
                }
                else if (templatesCount > 0)
                {
                    break;
                }
            }

            return new UserProfileDto
            {
                Name = user.Name,
                Email = user.Email,
                DOB = user.DOB,
                Address = user.Address,
                Mobile = user.Mobile,
                Gender = user.Gender,
                CreatedAt = user.CreatedAt,
                ProfileImagePath = user.ProfileImagePath,
                Streak = streak,
                TotalCompletedTasks = totalCompleted,
                CompletionPercentage = Math.Round(completionPercentage, 2)
            };
        }

        public async Task<bool> UpdateUserProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Name = dto.Name;
            user.DOB = dto.DOB;
            user.Address = dto.Address;
            user.Mobile = dto.Mobile;
            user.Gender = dto.Gender;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UploadProfileImageAsync(int userId, IFormFile file)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return string.Empty;

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images", "profiles");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Optional: delete old image if exists
            if (!string.IsNullOrEmpty(user.ProfileImagePath))
            {
                var oldFilePath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), user.ProfileImagePath.TrimStart('/'));
                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }
            }

            user.ProfileImagePath = $"/images/profiles/{uniqueFileName}";
            await _context.SaveChangesAsync();

            return user.ProfileImagePath;
        }
    }
}
