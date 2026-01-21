import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';

interface Note {
  id: number;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css'
})
export class NoteCardComponent implements OnInit {
  isExpanded = false;
  title = '';
  description = '';
  selectedColor = '#ffffff';
  imagePreview: string | null = null;
  notes: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  expandBox(): void {
    this.isExpanded = true;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveAndClose(): void {
    if (this.title.trim() || this.description.trim()) {
      const noteData = {
        title: this.title,
        content: this.description
      };

      this.noteService.createNote(noteData).subscribe({
        next: (response) => {
          console.log('Note created successfully:', response);
          this.loadNotes();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating note:', err);
          alert('Failed to create note. Please try again.');
        }
      });
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.isExpanded = false;
    this.title = '';
    this.description = '';
    this.selectedColor = '#ffffff';
    this.imagePreview = null;
  }

  loadNotes(): void {
    this.noteService.getAllNotes().subscribe({
      next: (data: any) => {
        console.log('Notes loaded:', data);
        this.notes = data.filter((note: any) => !note.isArchived);
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.notes = [];
      }
    });
  }

  editNote(note: Note, event: Event): void {
    event.stopPropagation();
    console.log('Edit note:', note);
    // TODO: Implement edit functionality
  }

  archiveNote(noteId: number, event: Event): void {
    event.stopPropagation();
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        console.log('Note archived');
        this.loadNotes();
      },
      error: (err) => console.error('Error archiving note:', err)
    });
  }

  deleteNote(noteId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          console.log('Note deleted');
          this.loadNotes();
        },
        error: (err) => console.error('Error deleting note:', err)
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isExpanded && !target.closest('.create-note')) {
      this.saveAndClose();
    }
  }
}
