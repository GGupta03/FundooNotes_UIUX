using System;
using System.Collections.Generic;
using System.Text;

using ModelLayer.DTOs.Collaborators;

namespace BusinessLayer.Interfaces
{
    public interface ICollaboratorService
    {
        Task<List<CollaboratorResponseDto>> GetByNoteAsync(int noteId, int userId);
        Task AddAsync(AddCollaboratorDto dto, int userId);
        Task DeleteAsync(int collaboratorId, int userId);
        Task UpdatePermissionAsync(int collaboratorId, string permission, int userId);
    }
}

