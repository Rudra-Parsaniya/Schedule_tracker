using System.ComponentModel.DataAnnotations;

namespace schedule_tracker.DTOs
{
    public class ScheduleDto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string TaskName { get; set; } = string.Empty;

        [Required]
        public string Time { get; set; } = string.Empty; // Using string to easily handle HH:mm format
    }
}
