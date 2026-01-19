import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otp: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Flow state
  step: 'email' | 'otp' | 'password' = 'email';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRequestOtp(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (response) => {
        console.log('Forgot password response:', response);
        this.successMessage = response.message || 'OTP sent to your email';
        this.step = 'otp';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Forgot password error:', error);
        this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onVerifyOtp(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP';
      return;
    }

    this.isLoading = true;

    this.authService.verifyOtp({
      email: this.email,
      otp: this.otp,
      purpose: 'FORGOT_PASSWORD'
    }).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
        this.successMessage = 'OTP verified. Now set your new password.';
        this.step = 'password';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('OTP verification error:', error);
        this.errorMessage = error.error?.message || 'OTP verification failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onResetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter both password fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword({
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: (response) => {
        console.log('Reset password response:', response);
        this.successMessage = 'Password reset successfully. Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Reset password error:', error);
        this.errorMessage = error.error?.message || 'Password reset failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
