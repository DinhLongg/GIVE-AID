using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProgramGoalAndDonationLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "GoalAmount",
                table: "NgoPrograms",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProgramId",
                table: "Donations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donations_ProgramId",
                table: "Donations",
                column: "ProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_NgoPrograms_ProgramId",
                table: "Donations",
                column: "ProgramId",
                principalTable: "NgoPrograms",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donations_NgoPrograms_ProgramId",
                table: "Donations");

            migrationBuilder.DropIndex(
                name: "IX_Donations_ProgramId",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "GoalAmount",
                table: "NgoPrograms");

            migrationBuilder.DropColumn(
                name: "ProgramId",
                table: "Donations");
        }
    }
}
