import { Component } from '@angular/core';
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
export class DashboardComponent {
  isGridView = true;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private viewService: ViewService
  ) {
    this.isGridView = this.viewService.isGridView();
  }

  toggleGridView(): void {
    this.viewService.toggleGridView();
    this.isGridView = !this.isGridView;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
