using DataBaseLayer.Entities;

namespace DataBaseLayer.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task<User?> GetByEmailAsync(string email);
        Task UpdateAsync(User user);
    }
}
