import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';

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
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
          console.error('Error creating note full response:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error error field:', err.error);
          
          let errorMsg = 'Failed to create note. Please try again.';
          if (err.status === 0) {
            errorMsg = 'Unable to connect to the server.';
          } else if (err.status === 400) {
            errorMsg = err.error?.message || 'Invalid note data. Please check your input.';
          } else if (err.status === 401) {
            errorMsg = 'Unauthorized. Please login again.';
          } else if (err.status === 500) {
            errorMsg = 'Server error: ' + (err.error?.message || 'Internal server error');
          }
          
          alert(errorMsg);
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
    this.isLoading = true;
    this.errorMessage = null;
    this.noteService.getAllNotes().subscribe({
      next: (data: any) => {
        console.log('Notes loaded:', data);
        this.notes = data.filter((note: any) => !note.isArchived);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.notes = [];
        this.isLoading = false;
        
        if (err.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please ensure the backend is running.';
        } else if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          // Automatically logout and redirect to login
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied.';
        } else if (err.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = `Error loading notes: ${err.statusText || 'Unknown error'}`;
        }
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
