using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;
using ModelLayer.DTOs.Notes;

namespace BusinessLayer.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository noteRepo;

        public NoteService(INoteRepository noteRepo)
        {
            this.noteRepo = noteRepo;
        }

        public async Task<List<NoteResponseDto>> GetAllAsync(int userId)
        {
            var notes = await noteRepo.GetAllAsync(userId);
            return notes.Select(n => new NoteResponseDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                Color = n.Color,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt
            }).ToList();
        }

        public async Task<NoteResponseDto> GetByIdAsync(int noteId, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            return new NoteResponseDto
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Color = note.Color,
                IsPinned = note.IsPinned,
                IsArchived = note.IsArchived,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            };
        }

        public async Task<NoteResponseDto> CreateAsync(CreateNoteDto dto, int userId)
        {
            var note = new Note
            {
                Title = dto.Title,
                Content = dto.Content,
                UserId = userId
            };

            await noteRepo.AddAsync(note);

            return new NoteResponseDto
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                Color = note.Color,
                IsPinned = note.IsPinned,
                IsArchived = note.IsArchived,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            };
        }

        public async Task UpdateAsync(int noteId, UpdateNoteDto dto, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.Title = dto.Title;
            note.Content = dto.Content;
            note.UpdatedAt = DateTime.UtcNow;

            await noteRepo.UpdateAsync(note);
        }

        // SOFT DELETE - Move to trash
        public async Task DeleteAsync(int noteId, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            await noteRepo.SoftDeleteAsync(note);
        }

        public async Task<List<NoteResponseDto>> SearchAsync(string keyword, int userId)
        {
            var notes = await noteRepo.SearchAsync(userId, keyword);
            return notes.Select(n => new NoteResponseDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                Color = n.Color,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt
            }).ToList();
        }

        public async Task PinAsync(int noteId, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.IsPinned = !note.IsPinned;
            note.UpdatedAt = DateTime.UtcNow;

            await noteRepo.UpdateAsync(note);
        }

        public async Task ArchiveAsync(int noteId, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.IsArchived = !note.IsArchived;
            note.UpdatedAt = DateTime.UtcNow;

            await noteRepo.UpdateAsync(note);
        }

        public async Task ChangeColorAsync(int noteId, string color, int userId)
        {
            var note = await noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.Color = color;
            note.UpdatedAt = DateTime.UtcNow;

            await noteRepo.UpdateAsync(note);
        }

        public async Task BulkDeleteAsync(List<int> noteIds, int userId)
        {
            var notes = await noteRepo.GetByIdsAsync(userId, noteIds);
            if (!notes.Any())
                throw new Exception("No notes found");

            foreach (var note in notes)
            {
                await noteRepo.SoftDeleteAsync(note);
            }
        }

        // ==================== NEW TRASH METHODS ====================

        // Get all trashed notes
        public async Task<List<NoteResponseDto>> GetTrashedAsync(int userId)
        {
            var notes = await noteRepo.GetTrashedAsync(userId);
            return notes.Select(n => new NoteResponseDto
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                Color = n.Color,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt
            }).ToList();
        }

        // Restore note from trash
        public async Task RestoreAsync(int noteId, int userId)
        {
            // Find in trash (include deleted notes)
            var note = await noteRepo.GetTrashedAsync(userId);
            var trashedNote = note.FirstOrDefault(n => n.Id == noteId)
                ?? throw new Exception("Note not found in trash");

            await noteRepo.RestoreAsync(trashedNote);
        }

        // Permanently delete note
        public async Task DeletePermanentlyAsync(int noteId, int userId)
        {
            var notes = await noteRepo.GetTrashedAsync(userId);
            var note = notes.FirstOrDefault(n => n.Id == noteId)
                ?? throw new Exception("Note not found in trash");

            await noteRepo.DeleteAsync(note); // Hard delete
        }

        // Empty entire trash
        public async Task EmptyTrashAsync(int userId)
        {
            var trashedNotes = await noteRepo.GetTrashedAsync(userId);
            foreach (var note in trashedNotes)
            {
                await noteRepo.DeleteAsync(note);
            }
        }
    }
}
