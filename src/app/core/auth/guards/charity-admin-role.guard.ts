import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const charityAdminRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const role = authService.getUserRole()?.toLowerCase();

  const isCharityAdmin =
    role === 'charityadmin' ||
    role === 'charity_admin' ||
    role === 'charity-admin';

  if (!isCharityAdmin) {
    return router.createUrlTree(['/profile']);
  }

  // ✅ allow access to charity-admin area
  return true;
};