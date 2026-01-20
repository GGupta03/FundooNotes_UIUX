using System;
using System.Collections.Generic;
using System.Text;
using DataBaseLayer.Entities;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.Repositories.Implementations
{
    public class CollaboratorRepository : ICollaboratorRepository
    {
        private readonly FundooNotesDbContext _context;

        public CollaboratorRepository(FundooNotesDbContext context)
        {
            _context = context;
        }

        public async Task<List<Collaborator>> GetByNoteAsync(int noteId)
        {
            return await _context.Collaborators
                .Include(c => c.CollaboratorUser)
                .Where(c => c.NoteId == noteId)
                .ToListAsync();
        }

        public async Task<Collaborator?> GetByIdAsync(int id)
        {
            return await _context.Collaborators.FindAsync(id);
        }

        public async Task<Collaborator?> GetByNoteAndUserAsync(int noteId, int userId)
        {
            return await _context.Collaborators
                .FirstOrDefaultAsync(c =>
                    c.NoteId == noteId &&
                    c.CollaboratorUserId == userId);
        }

        public async Task AddAsync(Collaborator collaborator)
        {
            await _context.Collaborators.AddAsync(collaborator);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Collaborator collaborator)
        {
            _context.Collaborators.Update(collaborator);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Collaborator collaborator)
        {
            _context.Collaborators.Remove(collaborator);
            await _context.SaveChangesAsync();
        }
    }
}

