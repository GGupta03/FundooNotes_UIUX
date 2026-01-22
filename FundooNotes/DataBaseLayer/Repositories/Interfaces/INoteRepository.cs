using DataBaseLayer.Entities;

namespace DataBaseLayer.Repositories.Interfaces
{
    public interface INoteRepository
    {
        Task<List<Note>> GetAllAsync(int userId);
        Task<Note?> GetByIdAsync(int noteId, int userId);
        Task AddAsync(Note note);
        Task UpdateAsync(Note note);
        Task DeleteAsync(Note note); // Hard delete
        Task<List<Note>> SearchAsync(int userId, string keyword);
        Task<List<Note>> GetByIdsAsync(int userId, List<int> ids);
        
        // NEW METHODS FOR TRASH
        Task<List<Note>> GetTrashedAsync(int userId);
        Task SoftDeleteAsync(Note note);
        Task RestoreAsync(Note note);
    }
}
