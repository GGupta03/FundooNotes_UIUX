import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check authentication on both server and browser
  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated - redirect to login
  if (isPlatformBrowser(platformId)) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  }
  
  return false;
};
