using System.ComponentModel.DataAnnotations;

namespace schedule_tracker.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime DOB { get; set; }

        [Required]
        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
