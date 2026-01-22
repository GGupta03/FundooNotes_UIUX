using DataBaseLayer.Entities;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.Repositories.Implementations
{
    public class NoteRepository : INoteRepository
    {
        private readonly FundooNotesDbContext context;

        public NoteRepository(FundooNotesDbContext context)
        {
            this.context = context;
        }

        // Get all non-deleted notes
        public async Task<List<Note>> GetAllAsync(int userId)
        {
            return await context.Notes
                .Where(n => n.UserId == userId && !n.IsDeleted) // Filter deleted notes
                .ToListAsync();
        }

        // Get note by ID (non-deleted only)
        public async Task<Note?> GetByIdAsync(int noteId, int userId)
        {
            return await context.Notes
                .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId && !n.IsDeleted);
        }

        public async Task AddAsync(Note note)
        {
            await context.Notes.AddAsync(note);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Note note)
        {
            context.Notes.Update(note);
            await context.SaveChangesAsync();
        }

        // Hard delete (permanent removal)
        public async Task DeleteAsync(Note note)
        {
            context.Notes.Remove(note);
            await context.SaveChangesAsync();
        }

        // Search non-deleted notes
        public async Task<List<Note>> SearchAsync(int userId, string keyword)
        {
            return await context.Notes
                .Where(n => n.UserId == userId && !n.IsDeleted &&
                    (n.Title.Contains(keyword) || n.Content.Contains(keyword)))
                .ToListAsync();
        }

        public async Task<List<Note>> GetByIdsAsync(int userId, List<int> ids)
        {
            return await context.Notes
                .Where(n => n.UserId == userId && !n.IsDeleted && ids.Contains(n.Id))
                .ToListAsync();
        }

        // ==================== NEW TRASH METHODS ====================

        // Get all trashed notes
        public async Task<List<Note>> GetTrashedAsync(int userId)
        {
            return await context.Notes
                .Where(n => n.UserId == userId && n.IsDeleted)
                .OrderByDescending(n => n.DeletedAt)
                .ToListAsync();
        }

        // Soft delete (move to trash)
        public async Task SoftDeleteAsync(Note note)
        {
            note.IsDeleted = true;
            note.DeletedAt = DateTime.UtcNow;
            note.IsPinned = false; // Unpin when moving to trash
            note.IsArchived = false; // Unarchive when moving to trash
            context.Notes.Update(note);
            await context.SaveChangesAsync();
        }

        // Restore from trash
        public async Task RestoreAsync(Note note)
        {
            note.IsDeleted = false;
            note.DeletedAt = null;
            context.Notes.Update(note);
            await context.SaveChangesAsync();
        }
    }
}
