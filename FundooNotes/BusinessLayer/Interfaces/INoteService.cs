using System;
using System.Collections.Generic;
using System.Text;
using ModelLayer.DTOs.Notes;

namespace BusinessLayer.Interfaces
{
    public interface INoteService
    {
        Task<List<NoteResponseDto>> GetAllAsync(int userId);
        Task<NoteResponseDto> GetByIdAsync(int noteId, int userId);
        Task<NoteResponseDto> CreateAsync(CreateNoteDto dto, int userId);
        Task UpdateAsync(int noteId, UpdateNoteDto dto, int userId);
        Task DeleteAsync(int noteId, int userId); // Move to trash
        Task<List<NoteResponseDto>> SearchAsync(string keyword, int userId);
        Task PinAsync(int noteId, int userId);
        Task ArchiveAsync(int noteId, int userId);
        Task ChangeColorAsync(int noteId, string color, int userId);
        Task BulkDeleteAsync(List<int> noteIds, int userId);
        
        // NEW TRASH METHODS
        Task<List<NoteResponseDto>> GetTrashedAsync(int userId);
        Task RestoreAsync(int noteId, int userId);
        Task DeletePermanentlyAsync(int noteId, int userId);
        Task EmptyTrashAsync(int userId);
    }
}
