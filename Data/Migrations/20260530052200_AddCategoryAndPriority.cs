using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace schedule_tracker.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndPriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "ScheduleTemplates",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "ScheduleTemplates",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "ScheduleTemplates");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "ScheduleTemplates");
        }
    }
}
