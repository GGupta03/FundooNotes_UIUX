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
        private readonly INoteService noteService;
        private readonly INoteLabelService noteLabelService;

        public NotesController(INoteService noteService, INoteLabelService noteLabelService)
        {
            this.noteService = noteService;
            this.noteLabelService = noteLabelService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        // ==================== BASIC NOTES ====================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var notes = await noteService.GetAllAsync(GetUserId());
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
                var note = await noteService.GetByIdAsync(id, GetUserId());
                return Ok(note);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = $"Note not found: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNoteDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Note data is required" });

                var result = await noteService.CreateAsync(dto, GetUserId());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error creating note: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateNoteDto dto)
        {
            try
            {
                await noteService.UpdateAsync(id, dto, GetUserId());
                return Ok(new { message = "Note updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating note: {ex.Message}" });
            }
        }

        // SOFT DELETE - Move to trash
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await noteService.DeleteAsync(id, GetUserId());
                return Ok(new { message = "Note moved to trash" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting note: {ex.Message}" });
            }
        }

        // ==================== ADVANCED NOTES ====================

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await noteService.SearchAsync(keyword, GetUserId());
            return Ok(result);
        }

        [HttpPatch("{id}/pin")]
        public async Task<IActionResult> Pin(int id)
        {
            try
            {
                await noteService.PinAsync(id, GetUserId());
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
                await noteService.ArchiveAsync(id, GetUserId());
                return Ok(new { message = "Archive status updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating archive status: {ex.Message}" });
            }
        }

        [HttpPatch("{id}/color")]
        public async Task<IActionResult> ChangeColor(int id, [FromBody] ChangeColorDto dto)
        {
            await noteService.ChangeColorAsync(id, dto.Color, GetUserId());
            return Ok("Color updated");
        }

        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDto dto)
        {
            await noteService.BulkDeleteAsync(dto.NoteIds, GetUserId());
            return Ok("Notes moved to trash");
        }

        // ==================== TRASH OPERATIONS ====================

        // Get all trashed notes
        [HttpGet("trash")]
        public async Task<IActionResult> GetTrashed()
        {
            try
            {
                var notes = await noteService.GetTrashedAsync(GetUserId());
                return Ok(notes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error fetching trash: {ex.Message}" });
            }
        }

        // Restore note from trash
        [HttpPost("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            try
            {
                await noteService.RestoreAsync(id, GetUserId());
                return Ok(new { message = "Note restored successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error restoring note: {ex.Message}" });
            }
        }

        // Permanently delete note
        [HttpDelete("{id}/permanent")]
        public async Task<IActionResult> DeletePermanently(int id)
        {
            try
            {
                await noteService.DeletePermanentlyAsync(id, GetUserId());
                return Ok(new { message = "Note permanently deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error permanently deleting note: {ex.Message}" });
            }
        }

        // Empty entire trash
        [HttpDelete("trash/empty")]
        public async Task<IActionResult> EmptyTrash()
        {
            try
            {
                await noteService.EmptyTrashAsync(GetUserId());
                return Ok(new { message = "Trash emptied successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error emptying trash: {ex.Message}" });
            }
        }

        // ==================== NOTE LABEL MAPPING ====================

        [HttpPost("{noteId}/labels/{labelId}")]
        public async Task<IActionResult> AddLabelToNote(int noteId, int labelId)
        {
            await noteLabelService.AddLabelToNoteAsync(noteId, labelId, GetUserId());
            return Ok("Label added to note");
        }

        [HttpDelete("{noteId}/labels/{labelId}")]
        public async Task<IActionResult> RemoveLabelFromNote(int noteId, int labelId)
        {
            await noteLabelService.RemoveLabelFromNoteAsync(noteId, labelId, GetUserId());
            return Ok("Label removed from note");
        }
    }
}
