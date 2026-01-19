import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  returnUrl: string = '';

  // OTP verification state
  showOtpInput: boolean = false;
  otp: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);
          
          if (response.token) {
            this.authService.saveToken(response.token);
            this.successMessage = 'Login successful! Redirecting...';
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 500);
          } else if (response.message) {
            // OTP sent for login
            this.successMessage = response.message || 'OTP sent to your email';
            this.showOtpInput = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          
          if (error.status === 0) {
            this.errorMessage = 'Connection error: Backend is not accessible. Make sure the backend is running on http://localhost:5001';
          } else if (error.status === 400 || error.status === 401) {
            this.errorMessage = error.error?.message || 'Invalid email or password';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          }
          
          this.isLoading = false;
        }
      });
  }

  onVerifyOtp(): void {
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyOtp({
      email: this.email,
      otp: this.otp,
      purpose: 'LOGIN'
    }).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
        
        if (response.token) {
          this.authService.saveToken(response.token);
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 500);
        } else {
          this.errorMessage = 'Unexpected response from server';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('OTP verification error:', error);
        this.errorMessage = error.error?.message || 'OTP verification failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
