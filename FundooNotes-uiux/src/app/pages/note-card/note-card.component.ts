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
  pinnedNotes: Note[] = [];
  otherNotes: Note[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  colors: string[] = [
    '#ffffff', // Default white
    '#f28b82', // Red
    '#fbbc04', // Orange
    '#fff475', // Yellow
    '#ccff90', // Green
    '#a7ffeb', // Teal
    '#cbf0f8', // Cyan
    '#aecbfa', // Blue
    '#d7aefb', // Purple
    '#fdcfe8', // Pink
    '#e6c9a8', // Brown
    '#e8eaed'  // Gray
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

  toggleColorPalette(event: Event): void {
    event.stopPropagation();
    this.showColorPalette = !this.showColorPalette;
  }

  selectColor(color: string, event: Event): void {
    event.stopPropagation();
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
        content: this.description
      };

      this.noteService.createNote(noteData).subscribe({
        next: (response: any) => {
          console.log('Note created successfully', response);
          
          // If color is not default white, update the color
          if (this.selectedColor !== '#ffffff' && response.id) {
            this.changeNoteColor(response.id, this.selectedColor, false);
          } else {
            this.loadNotes();
          }
          
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
        
        // Separate pinned and other notes
        this.pinnedNotes = this.notes.filter(note => note.isPinned);
        this.otherNotes = this.notes.filter(note => !note.isPinned);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notes', err);
        this.notes = [];
        this.pinnedNotes = [];
        this.otherNotes = [];
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

  changeNoteColor(noteId: number, color: string, reload: boolean = true): void {
    this.noteService.changeNoteColor(noteId, color).subscribe({
      next: () => {
        console.log('Color updated successfully');
        if (reload) {
          this.loadNotes();
        }
      },
      error: (err) => {
        console.error('Error changing color', err);
        if (reload) {
          this.loadNotes();
        }
      }
    });
  }

  togglePin(noteId: number, event: Event): void {
    event.stopPropagation();
    this.noteService.pinNote(noteId).subscribe({
      next: () => {
        console.log('Note pin status toggled');
        this.loadNotes();
      },
      error: (err) => {
        console.error('Error toggling pin', err);
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
