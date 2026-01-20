using DataBaseLayer.Entities;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.Repositories.Implementations
{
    public class NoteLabelRepository : INoteLabelRepository
    {
        private readonly FundooNotesDbContext _context;

        public NoteLabelRepository(FundooNotesDbContext context)
        {
            _context = context;
        }

        // Add label to note
        public async Task AddAsync(NoteLabel noteLabel)
        {
            await _context.NoteLabels.AddAsync(noteLabel);
            await _context.SaveChangesAsync();
        }

        // Get mapping (used to avoid duplicates)
        public async Task<NoteLabel?> GetAsync(int noteId, int labelId)
        {
            return await _context.NoteLabels
                .FirstOrDefaultAsync(
                    nl => nl.NoteId == noteId && nl.LabelId == labelId
                );
        }

        // Remove label from note
        public async Task RemoveAsync(NoteLabel noteLabel)
        {
            _context.NoteLabels.Remove(noteLabel);
            await _context.SaveChangesAsync();
        }

        // Get all labels for a note (USER-SAFE)
        public async Task<List<Label>> GetLabelsByNoteAsync(int noteId, int userId)
        {
            return await _context.NoteLabels
                .Where(nl => nl.NoteId == noteId && nl.Note.UserId == userId)
                .Select(nl => nl.Label)
                .ToListAsync();
        }

        // Get all notes for a label (USER-SAFE)
        public async Task<List<Note>> GetNotesByLabelAsync(int labelId, int userId)
        {
            return await _context.NoteLabels
                .Where(nl => nl.LabelId == labelId && nl.Label.UserId == userId)
                .Select(nl => nl.Note)
                .ToListAsync();
        }
    }
}
