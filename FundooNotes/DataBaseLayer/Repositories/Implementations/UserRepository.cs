using DataBaseLayer.Entities;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly FundooNotesDbContext _context;

        public UserRepository(FundooNotesDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
