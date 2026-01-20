using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelLayer.DTOs.Collaborators;
using System.Security.Claims;

namespace FundooNotes.Controllers
{
    [ApiController]
    [Route("api/collaborators")]
    [Authorize]
    public class CollaboratorsController : ControllerBase
    {
        private readonly ICollaboratorService _collabService;

        public CollaboratorsController(ICollaboratorService collabService)
        {
            _collabService = collabService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        // GET /api/collaborators/note/{noteId}
        [HttpGet("note/{noteId}")]
        public async Task<IActionResult> GetByNote(int noteId)
        {
            var result = await _collabService.GetByNoteAsync(noteId, GetUserId());
            return Ok(result);
        }

        // POST /api/collaborators
        [HttpPost]
        public async Task<IActionResult> Add(AddCollaboratorDto dto)
        {
            await _collabService.AddAsync(dto, GetUserId());
            return Ok("Collaborator added");
        }

        // DELETE /api/collaborators/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _collabService.DeleteAsync(id, GetUserId());
            return Ok("Collaborator removed");
        }

        // PATCH /api/collaborators/{id}/permission
        [HttpPatch("{id}/permission")]
        public async Task<IActionResult> UpdatePermission(int id, UpdatePermissionDto dto)
        {
            await _collabService.UpdatePermissionAsync(id, dto.Permission, GetUserId());
            return Ok("Permission updated");
        }
    }
}
