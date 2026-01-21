import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(data: { fullName: string; email: string; password: string }): Observable<any> {
    return this.apiService.post('auth/register', data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.apiService.post('auth/login', data);
  }

  verifyOtp(data: { email: string; otp: string; purpose: string }): Observable<any> {
    return this.apiService.post('auth/verify-otp', data).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.apiService.post('auth/forgot-password', data);
  }

  resetPassword(data: { email: string; otp: string; newPassword: string }): Observable<any> {
    return this.apiService.post('auth/reset-password', data);
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser()) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
