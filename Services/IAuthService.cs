using schedule_tracker.DTOs;

namespace schedule_tracker.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
