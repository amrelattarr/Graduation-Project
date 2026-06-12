import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');

  if (token && token !== 'null' && token !== 'undefined') {
    return router.parseUrl('/home');
  } else {
    return true;
  }
};