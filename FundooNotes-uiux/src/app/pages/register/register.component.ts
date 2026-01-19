import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // OTP verification state
  showOtpInput: boolean = false;
  otp: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        this.successMessage = response.message || 'OTP has been sent to your email.';
        this.showOtpInput = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
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
      purpose: 'REGISTER'
    }).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
        this.successMessage = response.message || 'Email verified successfully. Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('OTP verification error:', error);
        this.errorMessage = error.error?.message || 'OTP verification failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
