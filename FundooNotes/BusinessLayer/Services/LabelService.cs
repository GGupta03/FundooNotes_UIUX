using System;
using System.Collections.Generic;
using System.Text;
using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;
using ModelLayer.DTOs.Labels;

namespace BusinessLayer.Services
{
    public class LabelService : ILabelService
    {
        private readonly ILabelRepository _labelRepo;

        public LabelService(ILabelRepository labelRepo)
        {
            _labelRepo = labelRepo;
        }

        public async Task<List<LabelResponseDto>> GetAllAsync(int userId)
        {
            var labels = await _labelRepo.GetAllAsync(userId);

            return labels.Select(l => new LabelResponseDto
            {
                Id = l.Id,
                Name = l.Name
            }).ToList();
        }

        public async Task CreateAsync(CreateLabelDto dto, int userId)
        {
            var label = new Label
            {
                Name = dto.Name,
                UserId = userId
            };

            await _labelRepo.AddAsync(label);
        }

        public async Task UpdateAsync(int id, UpdateLabelDto dto, int userId)
        {
            var label = await _labelRepo.GetByIdAsync(id, userId)
                ?? throw new Exception("Label not found");

            label.Name = dto.Name;
            await _labelRepo.UpdateAsync(label);
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var label = await _labelRepo.GetByIdAsync(id, userId)
                ?? throw new Exception("Label not found");

            await _labelRepo.DeleteAsync(label);
        }
    }
}

