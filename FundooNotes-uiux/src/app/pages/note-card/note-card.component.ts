import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Note {
  title: string;
  description: string;
  createdAt: Date;
}

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',
})
export class NoteCardComponent {
  isExpanded = false;

  title = '';
  description = '';

  notes: Note[] = [];

  expandBox() {
    this.isExpanded = true;
  }

  saveAndClose() {
    const t = this.title.trim();
    const d = this.description.trim();

    if (t || d) {
      this.notes.unshift({
        title: t,
        description: d,
        createdAt: new Date(),
      });
    }

    this.title = '';
    this.description = '';
    this.isExpanded = false;
  }

  // ✅ click outside -> auto close like Google Keep
  @HostListener('document:click', ['$event'])
  outsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.create-note')) return;

    if (this.isExpanded) {
      this.saveAndClose();
    }
  }
}
