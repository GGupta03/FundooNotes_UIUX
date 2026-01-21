import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface EditNoteData {
  id: number;
  title: string;
  content: string;
  color: string;
}

@Component({
  selector: 'app-edit-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './edit-note-dialog.component.html',
  styleUrl: './edit-note-dialog.component.css'
})
export class EditNoteDialogComponent {
  editedTitle: string;
  editedContent: string;
  selectedColor: string;
  showColorPalette: boolean = false;

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
    public dialogRef: MatDialogRef<EditNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditNoteData
  ) {
    this.editedTitle = data.title;
    this.editedContent = data.content;
    this.selectedColor = data.color || '#ffffff';
  }

  toggleColorPalette(): void {
    this.showColorPalette = !this.showColorPalette;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  onSave(): void {
    this.dialogRef.close({
      title: this.editedTitle,
      content: this.editedContent,
      color: this.selectedColor
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
