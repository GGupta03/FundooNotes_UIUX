using System;
using System.Collections.Generic;
using System.Text;
using DataBaseLayer.Entities;

namespace DataBaseLayer.Repositories.Interfaces
{
    public interface INoteLabelRepository
    {
        Task AddAsync(NoteLabel noteLabel);
        Task<NoteLabel?> GetAsync(int noteId, int labelId);
        Task RemoveAsync(NoteLabel noteLabel);
        Task<List<Label>> GetLabelsByNoteAsync(int noteId, int userId);
        Task<List<Note>> GetNotesByLabelAsync(int labelId, int userId);
    }
}

