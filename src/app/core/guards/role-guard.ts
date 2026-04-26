import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userRole = localStorage.getItem('Role');
  const allowedRoles = route.data?.['roles'] as string[];

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  return router.parseUrl('/not found'); 
};