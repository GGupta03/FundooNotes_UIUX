import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ViewService } from '../../services/view.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isGridView: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private viewService: ViewService
  ) {}

  ngOnInit(): void {
    // Get initial value
    this.isGridView = this.viewService.isGridView;
    
    // Subscribe to changes
    this.viewService.gridView$.subscribe((isGrid: boolean) => {
      this.isGridView = isGrid;
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
