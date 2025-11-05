using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProgramRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // PasswordResetToken columns already added by migration 20251101120000_AddPasswordResetToUser
            // Skipping to avoid duplicate column error

            migrationBuilder.AlterColumn<string>(
                name: "TransactionReference",
                table: "Donations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorAddress",
                table: "Donations",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorEmail",
                table: "Donations",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DonorName",
                table: "Donations",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DonorPhone",
                table: "Donations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "Donations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SubscribeNewsletter",
                table: "Donations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ProgramRegistrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProgramId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramRegistrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgramRegistrations_NgoPrograms_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "NgoPrograms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProgramRegistrations_ProgramId",
                table: "ProgramRegistrations",
                column: "ProgramId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProgramRegistrations");

            // Don't drop PasswordResetToken columns - they were added by migration 20251101120000_AddPasswordResetToUser

            migrationBuilder.DropColumn(
                name: "DonorAddress",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorEmail",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorName",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorPhone",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "SubscribeNewsletter",
                table: "Donations");

            migrationBuilder.AlterColumn<string>(
                name: "TransactionReference",
                table: "Donations",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);
        }
    }
}
