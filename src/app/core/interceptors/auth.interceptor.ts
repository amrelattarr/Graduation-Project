import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const cleanToken =
    token && token !== 'undefined' && token !== 'null' && token.trim() !== ''
      ? token.trim()
      : null;

  if (cleanToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });

    console.log('🔐 Adding token to request:', cleanToken);
    return next(authReq);
  }

  console.warn('❌ No token found — request sent without auth');
  return next(req);
};