import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import { EditNoteDialogComponent, EditNoteData } from '../edit-note-dialog/edit-note-dialog.component';

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
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css'
})
export class NoteCardComponent implements OnInit {
  isExpanded = false;
  title = '';
  description = '';
  selectedColor = '#ffffff';
  imagePreview: string | null = null;
  showColorPalette = false;

  notes: Note[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  colors: string[] = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475',
    '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa',
    '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  expandBox(): void {
    this.isExpanded = true;
  }

  toggleColorPalette(): void {
    this.showColorPalette = !this.showColorPalette;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.showColorPalette = false;
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
        content: this.description,
        color: this.selectedColor
      };

      this.noteService.createNote(noteData).subscribe({
        next: (response) => {
          console.log('Note created successfully', response);
          this.loadNotes();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating note', err);
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
    this.showColorPalette = false;
  }

  loadNotes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.noteService.getAllNotes().subscribe({
      next: (data: any) => {
        this.notes = data.filter((note: any) => !note.isArchived);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notes', err);
        this.notes = [];
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Error loading notes. Please try again.';
        }
      }
    });
  }

  editNote(note: Note, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'edit-note-dialog-panel',
      data: {
        id: note.id,
        title: note.title,
        content: note.content,
        color: note.color || '#ffffff'
      } as EditNoteData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update note with new data
        this.updateNote(note.id, result);
      }
    });
  }

  updateNote(noteId: number, data: any): void {
    const updateData = {
      title: data.title,
      content: data.content
    };

    this.noteService.updateNote(noteId, updateData).subscribe({
      next: () => {
        // If color changed, update color separately
        if (data.color) {
          this.changeNoteColor(noteId, data.color);
        } else {
          this.loadNotes();
        }
      },
      error: (err) => {
        console.error('Error updating note', err);
        alert('Failed to update note. Please try again.');
      }
    });
  }

  changeNoteColor(noteId: number, color: string): void {
    this.noteService.changeNoteColor(noteId, color).subscribe({
      next: () => {
        console.log('Color updated successfully');
        this.loadNotes();
      },
      error: (err) => {
        console.error('Error changing color', err);
      }
    });
  }

  archiveNote(noteId: number, event: Event): void {
    event.stopPropagation();
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        console.log('Note archived');
        this.loadNotes();
      },
      error: (err) => {
        console.error('Error archiving note', err);
      }
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
        error: (err) => {
          console.error('Error deleting note', err);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isExpanded && !target.closest('.create-note')) {
      this.saveAndClose();
    }
  }
}
