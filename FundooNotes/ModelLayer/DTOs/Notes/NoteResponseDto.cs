using System;
using System.Collections.Generic;
using System.Text;

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
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}