using System;
using System.Collections.Generic;
using System.Text;

namespace DataBaseLayer.Entities
{
    public class NoteLabel
    {
        public int Id { get; set; }

        public int NoteId { get; set; }
        public Note Note { get; set; }

        public int LabelId { get; set; }
        public Label Label { get; set; }
    }
}

