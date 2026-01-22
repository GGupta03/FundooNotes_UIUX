import { Component, ViewChild } from '@angular/core';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NoteCardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  @ViewChild('noteCard') noteCard!: NoteCardComponent;

  setViewMode(isGridView: boolean): void {
    if (this.noteCard) {
      this.noteCard.isGridView = isGridView;
    }
  }
}
