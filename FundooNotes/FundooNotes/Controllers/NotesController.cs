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
            try
            {
                var notes = await _noteService.GetAllAsync(GetUserId());
                return Ok(notes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error fetching notes: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var note = await _noteService.GetByIdAsync(id, GetUserId());
                return Ok(note);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = $"Note not found: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateNoteDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { message = "Note data is required" });
                }

                var result = await _noteService.CreateAsync(dto, GetUserId());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error creating note: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateNoteDto dto)
        {
            try
            {
                await _noteService.UpdateAsync(id, dto, GetUserId());
                return Ok(new { message = "Note updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating note: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _noteService.DeleteAsync(id, GetUserId());
                return Ok(new { message = "Note deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting note: {ex.Message}" });
            }
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
            try
            {
                await _noteService.PinAsync(id, GetUserId());
                return Ok(new { message = "Pin status updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating pin status: {ex.Message}" });
            }
        }

        [HttpPatch("{id}/archive")]
        public async Task<IActionResult> Archive(int id)
        {
            try
            {
                await _noteService.ArchiveAsync(id, GetUserId());
                return Ok(new { message = "Archive status updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating archive status: {ex.Message}" });
            }
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
