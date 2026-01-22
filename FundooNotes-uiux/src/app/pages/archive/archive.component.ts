import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';
import { EditNoteDialogComponent, EditNoteData } from '../edit-note-dialog/edit-note-dialog.component';
import { ViewService } from '../../services/view.service';

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
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent implements OnInit {
  archivedNotes: Note[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isGridView: boolean = true;
  activeColorPaletteNoteId: number | null = null;

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
    private viewService: ViewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Get initial value using getter
    this.isGridView = this.viewService.isGridView;
  }

  ngOnInit(): void {
    this.loadArchivedNotes();
    
    // Subscribe to view changes
    this.viewService.gridView$.subscribe((isGrid: boolean) => {
      this.isGridView = isGrid;
    });
  }

  loadArchivedNotes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.noteService.getAllNotes().subscribe({
      next: (data: any) => {
        console.log('All notes loaded:', data);
        // Filter only archived notes
        this.archivedNotes = data.filter((note: any) => note.isArchived && !note.isDeleted);
        console.log('Archived notes:', this.archivedNotes);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading archived notes:', err);
        this.archivedNotes = [];
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Error loading archived notes. Please try again.';
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
      title: data.title || 'Untitled',
      content: data.content || ''
    };

    this.noteService.updateNote(noteId, updateData).subscribe({
      next: () => {
        console.log('Note updated successfully');
        if (data.color) {
          this.changeNoteColorAndReload(noteId, data.color);
        } else {
          this.loadArchivedNotes();
        }
      },
      error: (err) => {
        console.error('Error updating note:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Failed to update note. Please try again.');
        }
        this.loadArchivedNotes();
      }
    });
  }

  changeNoteColorAndReload(noteId: number, color?: string): void {
    const colorToApply = color || '#ffffff';
    this.noteService.changeNoteColor(noteId, colorToApply).subscribe({
      next: () => {
        console.log('Color updated successfully');
        this.loadArchivedNotes();
      },
      error: (err) => {
        console.error('Error changing color:', err);
        this.loadArchivedNotes();
      }
    });
  }

  changeNoteColor(noteId: number, color: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.noteService.changeNoteColor(noteId, color).subscribe({
      next: () => {
        console.log('Color updated successfully');
        this.activeColorPaletteNoteId = null;
        this.loadArchivedNotes();
      },
      error: (err) => {
        console.error('Error changing color:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleNotePalette(noteId: number, event: Event): void {
    event.stopPropagation();
    this.activeColorPaletteNoteId = this.activeColorPaletteNoteId === noteId ? null : noteId;
  }

  unarchiveNote(noteId: number, event: Event): void {
    event.stopPropagation();
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        console.log('Note unarchived');
        this.loadArchivedNotes();
      },
      error: (err) => {
        console.error('Error unarchiving note:', err);
      }
    });
  }

  deleteNote(noteId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note? It will be moved to Trash.')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          console.log('Note deleted successfully');
          this.loadArchivedNotes();
        },
        error: (err) => {
          console.error('Error deleting note:', err);
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            alert('Failed to delete note. Please try again.');
          }
          this.loadArchivedNotes();
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
