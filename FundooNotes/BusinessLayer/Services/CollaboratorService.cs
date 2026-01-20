using System;
using System.Collections.Generic;
using System.Text;
using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;
using ModelLayer.DTOs.Collaborators;

namespace BusinessLayer.Services
{
    public class CollaboratorService : ICollaboratorService
    {
        private readonly INoteRepository _noteRepo;
        private readonly IUserRepository _userRepo;
        private readonly ICollaboratorRepository _collabRepo;

        public CollaboratorService(
            INoteRepository noteRepo,
            IUserRepository userRepo,
            ICollaboratorRepository collabRepo)
        {
            _noteRepo = noteRepo;
            _userRepo = userRepo;
            _collabRepo = collabRepo;
        }

        public async Task<List<CollaboratorResponseDto>> GetByNoteAsync(int noteId, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            var collaborators = await _collabRepo.GetByNoteAsync(noteId);

            return collaborators.Select(c => new CollaboratorResponseDto
            {
                Id = c.Id,
                Email = c.CollaboratorUser.Email,
                Permission = c.Permission
            }).ToList();
        }

        public async Task AddAsync(AddCollaboratorDto dto, int userId)
        {
            var note = await _noteRepo.GetByIdAsync(dto.NoteId, userId)
                ?? throw new Exception("Note not found");

            var collaboratorUser = await _userRepo.GetByEmailAsync(dto.CollaboratorEmail)
                ?? throw new Exception("User not found");

            if (collaboratorUser.Id == userId)
                throw new Exception("Cannot add yourself");

            var existing = await _collabRepo.GetByNoteAndUserAsync(dto.NoteId, collaboratorUser.Id);
            if (existing != null)
                throw new Exception("User already collaborator");

            await _collabRepo.AddAsync(new Collaborator
            {
                NoteId = dto.NoteId,
                OwnerUserId = userId,
                CollaboratorUserId = collaboratorUser.Id,
                Permission = dto.Permission
            });
        }

        public async Task DeleteAsync(int collaboratorId, int userId)
        {
            var collab = await _collabRepo.GetByIdAsync(collaboratorId)
                ?? throw new Exception("Collaborator not found");

            if (collab.OwnerUserId != userId)
                throw new Exception("Only owner can remove collaborator");

            await _collabRepo.DeleteAsync(collab);
        }

        public async Task UpdatePermissionAsync(int collaboratorId, string permission, int userId)
        {
            var collab = await _collabRepo.GetByIdAsync(collaboratorId)
                ?? throw new Exception("Collaborator not found");

            if (collab.OwnerUserId != userId)
                throw new Exception("Only owner can update permission");

            collab.Permission = permission;
            await _collabRepo.UpdateAsync(collab);
        }
    }
}

