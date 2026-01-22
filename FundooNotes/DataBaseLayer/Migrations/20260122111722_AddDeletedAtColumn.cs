using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataBaseLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddDeletedAtColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Notes",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Notes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Reminder",
                table: "Notes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NoteId1",
                table: "Collaborators",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Collaborators_NoteId1",
                table: "Collaborators",
                column: "NoteId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Collaborators_Notes_NoteId1",
                table: "Collaborators",
                column: "NoteId1",
                principalTable: "Notes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collaborators_Notes_NoteId1",
                table: "Collaborators");

            migrationBuilder.DropIndex(
                name: "IX_Collaborators_NoteId1",
                table: "Collaborators");

            migrationBuilder.DropColumn(
                name: "Reminder",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "NoteId1",
                table: "Collaborators");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
