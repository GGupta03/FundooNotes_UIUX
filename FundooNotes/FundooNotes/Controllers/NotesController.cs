using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelLayer.DTOs.Notes;
using System.Security.Claims;

namespace FundooNotes.Controllers
{
    [ApiController]
    [Route("api/notes")]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly INoteService _noteService;
        private readonly INoteLabelService _noteLabelService; // ✅ ADD THIS

        public NotesController(
            INoteService noteService,
            INoteLabelService noteLabelService) // ✅ INJECT
        {
            _noteService = noteService;
            _noteLabelService = noteLabelService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        // ---------------- BASIC NOTES ----------------

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notes = await _noteService.GetAllAsync(GetUserId());
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var note = await _noteService.GetByIdAsync(id, GetUserId());
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateNoteDto dto)
        {
            await _noteService.CreateAsync(dto, GetUserId());
            return Ok("Note created successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateNoteDto dto)
        {
            await _noteService.UpdateAsync(id, dto, GetUserId());
            return Ok("Note updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _noteService.DeleteAsync(id, GetUserId());
            return Ok("Note deleted successfully");
        }

        // ---------------- ADVANCED NOTES ----------------

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await _noteService.SearchAsync(keyword, GetUserId());
            return Ok(result);
        }

        [HttpPatch("{id}/pin")]
        public async Task<IActionResult> Pin(int id)
        {
            await _noteService.PinAsync(id, GetUserId());
            return Ok("Pin status updated");
        }

        [HttpPatch("{id}/archive")]
        public async Task<IActionResult> Archive(int id)
        {
            await _noteService.ArchiveAsync(id, GetUserId());
            return Ok("Archive status updated");
        }

        [HttpPatch("{id}/color")]
        public async Task<IActionResult> ChangeColor(int id, ChangeColorDto dto)
        {
            await _noteService.ChangeColorAsync(id, dto.Color, GetUserId());
            return Ok("Color updated");
        }

        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete(BulkDeleteDto dto)
        {
            await _noteService.BulkDeleteAsync(dto.NoteIds, GetUserId());
            return Ok("Notes deleted successfully");
        }

        // ---------------- NOTE ↔ LABEL MAPPING ----------------

        // ADD LABEL TO NOTE
        [HttpPost("{noteId}/labels/{labelId}")]
        public async Task<IActionResult> AddLabelToNote(int noteId, int labelId)
        {
            await _noteLabelService.AddLabelToNoteAsync(
                noteId,
                labelId,
                GetUserId()
            );

            return Ok("Label added to note");
        }

        // REMOVE LABEL FROM NOTE
        [HttpDelete("{noteId}/labels/{labelId}")]
        public async Task<IActionResult> RemoveLabelFromNote(int noteId, int labelId)
        {
            await _noteLabelService.RemoveLabelFromNoteAsync(
                noteId,
                labelId,
                GetUserId()
            );

            return Ok("Label removed from note");
        }
    }
}
