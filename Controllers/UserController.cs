using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using schedule_tracker.DTOs;
using schedule_tracker.Services;
using System.Security.Claims;

namespace schedule_tracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _userService.GetUserProfileAsync(userId);
            if (profile == null) return NotFound(new { message = "User not found" });

            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var success = await _userService.UpdateUserProfileAsync(userId, dto);
            if (!success) return NotFound(new { message = "User not found" });

            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var success = await _userService.ChangePasswordAsync(userId, dto);
            if (!success) return BadRequest(new { message = "Invalid current password or user not found" });

            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPost("profile-image")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { message = "No file uploaded" });

            var userId = GetUserId();
            var path = await _userService.UploadProfileImageAsync(userId, file);
            if (string.IsNullOrEmpty(path)) return BadRequest(new { message = "Failed to upload image" });

            return Ok(new { message = "Profile image uploaded successfully", path });
        }
    }
}
