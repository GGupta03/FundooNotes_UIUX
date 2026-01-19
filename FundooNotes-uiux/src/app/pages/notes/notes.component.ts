import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteService, Note, CreateNoteRequest } from '../../services/note.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteCardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
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

    this.noteService.getNotes().subscribe({
      next: (data) => {
        // Filter out archived and trashed notes
        this.notes = data.filter(note => !note.isArchived && !note.isTrashed);
        this.isLoading = false;
      },
      error: (error) => {
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

    const request: CreateNoteRequest = {
      title: this.newNoteTitle,
      description: this.newNoteDescription
    };

    this.noteService.createNote(request).subscribe({
      next: (newNote) => {
        this.notes.unshift(newNote);
        this.newNoteTitle = '';
        this.newNoteDescription = '';
      },
      error: (error) => {
        console.error('Error creating note:', error);
        this.errorMessage = 'Failed to create note';
      }
    });
  }

  deleteNote(noteId: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.trashNote(noteId).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note.id !== noteId);
        },
        error: (error) => {
          console.error('Error deleting note:', error);
          this.errorMessage = 'Failed to delete note';
        }
      });
    }
  }
}
