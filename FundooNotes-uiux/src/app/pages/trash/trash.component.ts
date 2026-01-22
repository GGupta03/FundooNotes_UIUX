import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css'
})
export class TrashComponent implements OnInit {
  trashNotes: Note[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadTrashNotes();
  }

  loadTrashNotes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.noteService.getTrashNotes().subscribe({
      next: (data: any) => {
        console.log('Trash notes loaded:', data);
        this.trashNotes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trash notes:', err);
        this.trashNotes = [];
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Error loading trash notes. Please try again.';
        }
      }
    });
  }

  restoreNote(noteId: number, event: Event): void {
    event.stopPropagation();
    
    this.noteService.restoreNote(noteId).subscribe({
      next: () => {
        console.log('Note restored successfully');
        this.loadTrashNotes(); // Reload trash to remove restored note
      },
      error: (err) => {
        console.error('Error restoring note:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Failed to restore note. Please try again.');
        }
      }
    });
  }

  permanentDeleteNote(noteId: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      this.noteService.permanentDeleteNote(noteId).subscribe({
        next: () => {
          console.log('Note permanently deleted');
          this.loadTrashNotes();
        },
        error: (err) => {
          console.error('Error permanently deleting note:', err);
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            alert('Failed to delete note permanently. Please try again.');
          }
        }
      });
    }
  }

  emptyTrash(): void {
    if (this.trashNotes.length === 0) {
      alert('Trash is already empty.');
      return;
    }

    if (confirm('Are you sure you want to permanently delete all notes in trash? This action cannot be undone.')) {
      this.noteService.emptyTrash().subscribe({
        next: () => {
          console.log('Trash emptied successfully');
          this.loadTrashNotes();
        },
        error: (err) => {
          console.error('Error emptying trash:', err);
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            alert('Failed to empty trash. Please try again.');
          }
        }
      });
    }
  }
}
