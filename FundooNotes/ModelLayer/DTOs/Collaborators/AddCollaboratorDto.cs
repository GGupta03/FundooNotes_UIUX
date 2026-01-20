using System;
using System.Collections.Generic;
using System.Text;

namespace ModelLayer.DTOs.Collaborators
{
    public class AddCollaboratorDto
    {
        public int NoteId { get; set; }
        public string CollaboratorEmail { get; set; }
        public string Permission { get; set; } // READ / EDIT
    }
}
