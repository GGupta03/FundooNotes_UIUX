using System;

namespace ModelLayer.DTOs.Notes
{
    public class NoteResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public bool IsPinned { get; set; }
        public bool IsArchived { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; } // ADD THIS
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
