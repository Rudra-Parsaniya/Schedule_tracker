namespace schedule_tracker.DTOs
{
    public class DashboardStatsDto
    {
        public double DailyCompletionPercentage { get; set; }
        public int TotalCompletedTasks { get; set; }
        public int Streak { get; set; }
        public double ConsistencyScore { get; set; }
        public List<GraphDataPoint> WeeklyGraph { get; set; } = new();
        public List<GraphDataPoint> MonthlyGraph { get; set; } = new();
    }

    public class GraphDataPoint
    {
        public string Label { get; set; } = string.Empty;
        public double Value { get; set; }
    }
}
