import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Strict check: No null, no undefined string, no empty spaces
  if (token && token !== 'undefined' && token !== 'null') {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`
      }
    });
    return next(cloned);
  }

  return next(req);
};