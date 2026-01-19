import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: 'REGISTER' | 'LOGIN' | 'FORGOT_PASSWORD';
}

export interface AuthResponse {
  message: string;
  token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  constructor(private apiService: ApiService) {}

  /**
   * Register user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', request);
  }

  /**
   * Login user
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', request);
  }

  /**
   * Verify OTP
   */
  verifyOtp(request: VerifyOtpRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/verify-otp', request);
  }

  /**
   * Forgot password - sends OTP to email
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/forgot-password', request);
  }

  /**
   * Reset password with OTP
   */
  resetPassword(request: ResetPasswordRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/reset-password', request);
  }

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  /**
   * Logout user
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}
