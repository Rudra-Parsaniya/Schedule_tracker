using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schedule_tracker.Models
{
    public class Reminder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime ReminderDateTime { get; set; }

        public bool IsSent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
