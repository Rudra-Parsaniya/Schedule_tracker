using Microsoft.EntityFrameworkCore;

namespace schedule_tracker.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Models.User> Users { get; set; }
        public DbSet<Models.ScheduleTemplate> ScheduleTemplates { get; set; }
        public DbSet<Models.TaskCompletion> TaskCompletions { get; set; }
        public DbSet<Models.Reminder> Reminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
