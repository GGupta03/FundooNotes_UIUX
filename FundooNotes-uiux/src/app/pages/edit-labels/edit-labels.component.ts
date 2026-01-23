import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LabelService, Label } from '../../services/label.service';

@Component({
  selector: 'app-edit-labels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './edit-labels.component.html',
  styleUrl: './edit-labels.component.css'
})
export class EditLabelsComponent implements OnInit {
  labels: Label[] = [];
  newLabelName: string = '';
  editingLabel: Label | null = null;

  constructor(
    private labelService: LabelService,
    public dialogRef: MatDialogRef<EditLabelsComponent>
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error) => {
        console.error('Error loading labels:', error);
      }
    });
  }

  createLabel(): void {
    if (this.newLabelName.trim()) {
      this.labelService.createLabel(this.newLabelName.trim()).subscribe({
        next: () => {
          this.newLabelName = '';
          this.loadLabels();
        },
        error: (error) => {
          console.error('Error creating label:', error);
        }
      });
    }
  }

  startEdit(label: Label): void {
    this.editingLabel = { id: label.id, name: label.name };
  }

  cancelEdit(): void {
    this.editingLabel = null;
  }

  saveLabel(): void {
    if (this.editingLabel && this.editingLabel.name.trim()) {
      this.labelService.updateLabel(this.editingLabel.id, this.editingLabel.name.trim()).subscribe({
        next: () => {
          this.editingLabel = null;
          this.loadLabels();
        },
        error: (error) => {
          console.error('Error updating label:', error);
        }
      });
    }
  }

  deleteLabel(id: number): void {
    this.labelService.deleteLabel(id).subscribe({
      next: () => {
        this.loadLabels();
      },
      error: (error) => {
        console.error('Error deleting label:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
