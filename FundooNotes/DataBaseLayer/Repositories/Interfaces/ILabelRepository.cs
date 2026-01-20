using System;
using System.Collections.Generic;
using System.Text;
using DataBaseLayer.Entities;

namespace DataBaseLayer.Repositories.Interfaces
{
    public interface ILabelRepository
    {
        Task<List<Label>> GetAllAsync(int userId);
        Task<Label?> GetByIdAsync(int id, int userId);
        Task AddAsync(Label label);
        Task UpdateAsync(Label label);
        Task DeleteAsync(Label label);
    }
}
