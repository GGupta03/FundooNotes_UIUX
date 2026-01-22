using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataBaseLayer.Entities
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Color { get; set; } = "#ffffff";

        public bool IsPinned { get; set; } = false;
        public bool IsArchived { get; set; } = false;
        public bool IsDeleted { get; set; } = false;

        public DateTime? DeletedAt { get; set; } // ADD THIS

        public DateTime? Reminder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        public ICollection<NoteLabel> NoteLabels { get; set; }
        public ICollection<Collaborator> Collaborators { get; set; }
    }
}
