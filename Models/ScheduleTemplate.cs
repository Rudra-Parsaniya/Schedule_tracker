using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schedule_tracker.Models
{
    public class ScheduleTemplate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(200)]
        public string TaskName { get; set; } = string.Empty;

        [Required]
        public TimeSpan Time { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
