using System;
using System.Collections.Generic;
using System.Text;
using ModelLayer.DTOs.Labels;

namespace BusinessLayer.Interfaces
{
    public interface ILabelService
    {
        Task<List<LabelResponseDto>> GetAllAsync(int userId);
        Task CreateAsync(CreateLabelDto dto, int userId);
        Task UpdateAsync(int id, UpdateLabelDto dto, int userId);
        Task DeleteAsync(int id, int userId);
    }
}

