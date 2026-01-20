import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteCardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent implements OnInit {
  notes: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  newNoteTitle: string = '';
  newNoteDescription: string = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.noteService.getAllNotes().subscribe({
      next: (data: any) => {
        // Filter out archived notes
        this.notes = data.filter((note: any) => !note.isArchived);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading notes:', error);
        this.errorMessage = 'Failed to load notes';
        this.isLoading = false;
      }
    });
  }

  createNote(): void {
    if (!this.newNoteTitle && !this.newNoteDescription) {
      alert('Please enter title or description');
      return;
    }

    this.noteService.createNote({
      title: this.newNoteTitle,
      content: this.newNoteDescription
    }).subscribe({
      next: (newNote: any) => {
        this.notes.unshift(newNote);
        this.newNoteTitle = '';
        this.newNoteDescription = '';
      },
      error: (error: any) => {
        console.error('Error creating note:', error);
        this.errorMessage = 'Failed to create note';
      }
    });
  }

  deleteNote(noteId: number): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          this.notes = this.notes.filter((note: any) => note.id !== noteId);
        },
        error: (error: any) => {
          console.error('Error deleting note:', error);
          this.errorMessage = 'Failed to delete note';
        }
      });
    }
  }
}
