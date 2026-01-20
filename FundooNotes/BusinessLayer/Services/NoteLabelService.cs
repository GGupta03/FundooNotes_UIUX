using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;

namespace BusinessLayer.Services
{
    public class NoteLabelService : INoteLabelService
    {
        private readonly INoteRepository _noteRepo;
        private readonly ILabelRepository _labelRepo;
        private readonly INoteLabelRepository _noteLabelRepo;

        public NoteLabelService(
            INoteRepository noteRepo,
            ILabelRepository labelRepo,
            INoteLabelRepository noteLabelRepo)
        {
            _noteRepo = noteRepo;
            _labelRepo = labelRepo;
            _noteLabelRepo = noteLabelRepo;
        }

        // ---------------- ADD LABEL TO NOTE ----------------
        public async Task AddLabelToNoteAsync(int noteId, int labelId, int userId)
        {
            // 1. Validate note ownership
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            // 2. Validate label ownership
            var label = await _labelRepo.GetByIdAsync(labelId, userId)
                ?? throw new Exception("Label not found");

            // 3. Prevent duplicate mapping
            var existing = await _noteLabelRepo.GetAsync(noteId, labelId);
            if (existing != null)
                throw new Exception("Label already added to this note");

            // 4. Create mapping
            var noteLabel = new NoteLabel
            {
                NoteId = noteId,
                LabelId = labelId
            };

            await _noteLabelRepo.AddAsync(noteLabel);
        }

        // ---------------- REMOVE LABEL FROM NOTE ----------------
        public async Task RemoveLabelFromNoteAsync(int noteId, int labelId, int userId)
        {
            // Ownership validation
            var note = await _noteRepo.GetByIdAsync(noteId, userId)
                ?? throw new Exception("Note not found");

            var label = await _labelRepo.GetByIdAsync(labelId, userId)
                ?? throw new Exception("Label not found");

            // Mapping check
            var mapping = await _noteLabelRepo.GetAsync(noteId, labelId)
                ?? throw new Exception("Label not attached to this note");

            await _noteLabelRepo.RemoveAsync(mapping);
        }
    }
}
