using System.ComponentModel.DataAnnotations;

namespace schedule_tracker.DTOs
{
    public class ReminderDto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime ReminderDateTime { get; set; }
        
        public bool IsSent { get; set; }
    }
}
