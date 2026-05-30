namespace schedule_tracker.DTOs
{
    public class ScheduleTodayDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public string Priority { get; set; } = "Medium";
        public bool IsCompleted { get; set; }
    }
}
