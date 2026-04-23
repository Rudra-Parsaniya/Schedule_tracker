namespace schedule_tracker.DTOs
{
    public class ScheduleTodayDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
    }
}
