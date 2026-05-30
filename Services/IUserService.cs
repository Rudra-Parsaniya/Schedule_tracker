using Microsoft.AspNetCore.Http;
using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetUserProfileAsync(int userId);
        Task<bool> UpdateUserProfileAsync(int userId, UpdateProfileDto dto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
        Task<string> UploadProfileImageAsync(int userId, IFormFile file);
    }
}
