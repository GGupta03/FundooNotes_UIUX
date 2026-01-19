import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interceptor for specific requests if needed
    if (request.url.includes('/assets/')) {
      return next.handle(request);
    }

    // Clone request and add headers (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token && !request.headers.has('Authorization')) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (error.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.authService.logout();
          if (isPlatformBrowser(this.platformId)) {
            this.router.navigate(['/login']);
          }
        } else if (error.status === 403) {
          console.error('Forbidden:', error.message);
        } else if (error.status === 0) {
          console.error('Connection Error:', error.message);
          console.error('Unable to connect to backend. Make sure the backend is running on http://localhost:5001');
        }

        return throwError(() => error);
      })
    );
  }
}
