using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;
using ModelLayer.DTOs.Notes;

namespace BusinessLayer.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _noteRepo;

        public NoteService(INoteRepository noteRepo)
        {
            _noteRepo = noteRepo;
        }

        public async Task<List<NoteResponseDto>> GetAllAsync(int userId)
        {
            var notes = await _noteRepo.GetAllAsync(userId);

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
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
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

        public async Task CreateAsync(CreateNoteDto dto, int userId)
        {
            var note = new Note
            {
                Title = dto.Title,
                Content = dto.Content,
                UserId = userId
            };

            await _noteRepo.AddAsync(note);
        }

        public async Task UpdateAsync(int noteId, UpdateNoteDto dto, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.Title = dto.Title;
            note.Content = dto.Content;
            note.UpdatedAt = DateTime.UtcNow;

            await _noteRepo.UpdateAsync(note);
        }

        public async Task DeleteAsync(int noteId, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            await _noteRepo.DeleteAsync(note);
        }
        public async Task<List<NoteResponseDto>> SearchAsync(string keyword, int userId)
        {
            var notes = await _noteRepo.SearchAsync(userId, keyword);

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
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.IsPinned = !note.IsPinned;
            note.UpdatedAt = DateTime.UtcNow;

            await _noteRepo.UpdateAsync(note);
        }
        public async Task ArchiveAsync(int noteId, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.IsArchived = !note.IsArchived;
            note.UpdatedAt = DateTime.UtcNow;

            await _noteRepo.UpdateAsync(note);
        }
        public async Task ChangeColorAsync(int noteId, string color, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            note.Color = color;
            note.UpdatedAt = DateTime.UtcNow;

            await _noteRepo.UpdateAsync(note);
        }
        public async Task BulkDeleteAsync(List<int> noteIds, int userId)
        {
            var notes = await _noteRepo.GetByIdsAsync(userId, noteIds);

            if (!notes.Any())
                throw new Exception("No notes found");

            foreach (var note in notes)
            {
                await _noteRepo.DeleteAsync(note);
            }
        }
    }
}
