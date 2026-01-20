using System;
using System.Collections.Generic;
using System.Text;

namespace DataBaseLayer.Entities
{
    public class Collaborator
    {
        public int Id { get; set; }

        public int NoteId { get; set; }
        public Note Note { get; set; }

        // Note owner
        public int OwnerUserId { get; set; }
        public User Owner { get; set; }

        // Collaborating user
        public int CollaboratorUserId { get; set; }
        public User CollaboratorUser { get; set; }

        // READ / EDIT
        public string Permission { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

