import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  otp: string = '';
  showOtpInput: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'OTP sent to your email';
        this.showOtpInput = true;
        
        // If token is returned immediately (no OTP required)
        if (response.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
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

    if (this.otp.length !== 6) {
      this.errorMessage = 'OTP must be 6 digits';
      return;
    }

    this.isLoading = true;

    const otpData = {
      email: this.email,
      otp: this.otp,
      purpose: 'LOGIN'
    };

    this.authService.verifyOtp(otpData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Login successful!';
        
        if (response.token) {
          this.authService.saveToken(response.token);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid OTP. Please try again.';
        console.error('OTP verification error:', error);
      }
    });
  }

  onResendOtp(): void {
    this.otp = '';
    this.errorMessage = '';
    this.successMessage = '';
    
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.successMessage = 'OTP resent successfully!';
      },
      error: (error) => {
        this.errorMessage = 'Failed to resend OTP. Please try again.';
      }
    });
  }
}
