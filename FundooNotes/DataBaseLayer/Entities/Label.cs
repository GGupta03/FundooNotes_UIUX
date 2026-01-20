using System;
using System.Collections.Generic;
using System.Text;

namespace DataBaseLayer.Entities
{
    public class Label
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<NoteLabel> NoteLabels { get; set; }
    }
}
