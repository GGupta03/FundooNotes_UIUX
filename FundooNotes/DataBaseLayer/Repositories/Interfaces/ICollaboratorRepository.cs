using System;
using System.Collections.Generic;
using System.Text;
using DataBaseLayer.Entities;

namespace DataBaseLayer.Repositories.Interfaces
{
    public interface ICollaboratorRepository
    {
        Task<List<Collaborator>> GetByNoteAsync(int noteId);
        Task<Collaborator?> GetByIdAsync(int id);
        Task<Collaborator?> GetByNoteAndUserAsync(int noteId, int userId);
        Task AddAsync(Collaborator collaborator);
        Task UpdateAsync(Collaborator collaborator);
        Task DeleteAsync(Collaborator collaborator);
    }
}

