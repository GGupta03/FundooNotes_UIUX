using DataBaseLayer.Entities;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.Repositories.Implementations
{
    public class NoteRepository : INoteRepository
    {
        private readonly FundooNotesDbContext _context;

        public NoteRepository(FundooNotesDbContext context)
        {
            _context = context;
        }

        public async Task<List<Note>> GetAllAsync(int userId)
        {
            return await _context.Notes
                .Where(n => n.UserId == userId)
                .ToListAsync();
        }

        public async Task<Note?> GetByIdAsync(int noteId, int userId)
        {
            return await _context.Notes
                .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);
        }

        public async Task AddAsync(Note note)
        {
            await _context.Notes.AddAsync(note);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Note note)
        {
            _context.Notes.Update(note);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Note note)
        {
            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Note>> SearchAsync(int userId, string keyword)
        {
            return await _context.Notes
                .Where(n =>
                    n.UserId == userId &&
                    (n.Title.Contains(keyword) || n.Content.Contains(keyword)))
                .ToListAsync();
        }

        public async Task<List<Note>> GetByIdsAsync(int userId, List<int> ids)
        {
            return await _context.Notes
                .Where(n => n.UserId == userId && ids.Contains(n.Id))
                .ToListAsync();
        }
    }
}
