using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLayer.Interfaces
{
    public interface INoteLabelService
    {
        Task AddLabelToNoteAsync(int noteId, int labelId, int userId);
        Task RemoveLabelFromNoteAsync(int noteId, int labelId, int userId);
    }
}

