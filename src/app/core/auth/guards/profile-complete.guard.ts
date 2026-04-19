import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const charityAdminRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getUserRole()?.toLowerCase();

  // FIXED: safer role check
  const isCharityAdmin =
    role === 'charityadmin' ||
    role === 'charity_admin' ||
    role === 'charity-admin';

  if (!isCharityAdmin) {
    router.navigate(['/profile']);
    return false;
  }

  return true;
};