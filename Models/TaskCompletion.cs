using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace schedule_tracker.Models
{
    public class TaskCompletion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TemplateId { get; set; }

        [ForeignKey("TemplateId")]
        public ScheduleTemplate? Template { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public bool IsCompleted { get; set; }
    }
}
