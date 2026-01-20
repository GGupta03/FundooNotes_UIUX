using System;
using System.Collections.Generic;
using System.Text;

namespace DataBaseLayer.Entities
{
    public class Note
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }

        public bool IsPinned { get; set; }
        public bool IsArchived { get; set; }
        public string? Color { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<NoteLabel> NoteLabels { get; set; }
    }

}

