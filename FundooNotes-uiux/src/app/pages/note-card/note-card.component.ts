import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';

interface Note {
  id?: number;
  title: string;
  description: string;
  createdAt: Date;
  color?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',
})
export class NoteCardComponent implements OnInit {
  isExpanded = false;

  title = '';
  description = '';
  selectedColor = '#FFFFFF';
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  notes: Note[] = [];
  loading = false;
  error = '';
  selectedNoteId: number | null = null;
  editingNoteId: number | null = null;

  colorPalette = [
    '#FFFFFF', '#F28482', '#F4CCCC', '#FCE5CD', '#F8F7F1',
    '#E2EFDA', '#E6F3FF', '#EAE6FF', '#F3E6FF', '#FCE5FF'
  ];

  constructor(
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        this.notes = response || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notes';
        this.loading = false;
      }
    });
  }

  expandBox() {
    this.isExpanded = true;
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }

  saveAndClose() {
    const t = (this.title || '').trim();
    const d = (this.description || '').trim();

    if (!t && !d) {
      this.closeForm();
      return;
    }

    this.loading = true;

    if (this.editingNoteId) {
      // Update existing note
      this.noteService.updateNote(this.editingNoteId, {
        title: t,
        content: d,
        color: this.selectedColor
      }).subscribe({
        next: () => {
          this.loadNotes();
          this.closeForm();
        },
        error: (err) => {
          this.error = 'Failed to update note';
          this.loading = false;
        }
      });
    } else {
      // Create new note
      this.noteService.createNote({
        title: t,
        content: d
      }).subscribe({
        next: () => {
          this.loadNotes();
          this.closeForm();
        },
        error: (err) => {
          this.error = 'Failed to save note';
          this.loading = false;
        }
      });
    }
  }

  closeForm() {
    this.title = '';
    this.description = '';
    this.selectedColor = '#FFFFFF';
    this.imageFile = null;
    this.imagePreview = null;
    this.isExpanded = false;
    this.editingNoteId = null;
  }

  deleteNote(noteId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this note?')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          this.loadNotes();
        },
        error: (err) => {
          this.error = 'Failed to delete note';
        }
      });
    }
  }

  archiveNote(noteId: number, event: Event) {
    event.stopPropagation();
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (err) => {
        this.error = 'Failed to archive note';
      }
    });
  }

  pinNote(noteId: number, event: Event) {
    event.stopPropagation();
    this.noteService.pinNote(noteId).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (err) => {
        this.error = 'Failed to pin note';
      }
    });
  }

  editNote(note: Note, event: Event) {
    event.stopPropagation();
    this.title = note.title;
    this.description = note.description;
    this.selectedColor = note.color || '#FFFFFF';
    this.editingNoteId = note.id || null;
    this.isExpanded = true;
    this.selectedNoteId = note.id || null;
  }

  changeNoteColor(noteId: number, color: string, event: Event) {
    event.stopPropagation();
    this.noteService.changeNoteColor(noteId, color).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (err) => {
        this.error = 'Failed to change color';
      }
    });
  }

  // ✅ click outside -> auto close like Google Keep
  @HostListener('document:click', ['$event'])
  outsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.create-note')) return;
    if (target.closest('.color-picker')) return;
    if (target.closest('.more-menu')) return;

    if (this.isExpanded) {
      this.saveAndClose();
    }
  }
}
