import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ViewService } from '../../services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { EditLabelsComponent } from '../edit-labels/edit-labels.component';
import { LabelService, Label } from '../../services/label.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isGridView: boolean = true;
  labels: Label[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog,
    private labelService: LabelService
  ) {}

  ngOnInit(): void {
    // Get initial value
    this.isGridView = this.viewService.isGridView;
    
    // Subscribe to changes
    this.viewService.gridView$.subscribe((isGrid: boolean) => {
      this.isGridView = isGrid;
    });

    // Load labels
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.labels$.subscribe((labels: Label[]) => {
      this.labels = labels;
    });
    this.labelService.getLabels().subscribe();
  }

  openEditLabels(): void {
    const dialogRef = this.dialog.open(EditLabelsComponent, {
      width: '300px',
      panelClass: 'edit-labels-dialog',
      disableClose: false,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadLabels();
    });
  }

  toggleGridView(): void {
    this.viewService.toggleGridView();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
