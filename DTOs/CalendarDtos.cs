namespace schedule_tracker.DTOs
{
    public class MonthlyCalendarDayDto
    {
        public DateTime Date { get; set; }
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public double CompletionPercentage { get; set; }
        public bool IsFullyCompleted { get; set; }
    }

    public class CalendarDayDetailDto
    {
        public DateTime Date { get; set; }
        public List<TaskDetailDto> Tasks { get; set; } = new();
    }

    public class TaskDetailDto
    {
        public string TaskName { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public TimeSpan Time { get; set; }
    }
}
