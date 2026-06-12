import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';

let isRefreshing = false;

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

  const authService = inject(AuthService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      // Handle only Unauthorized errors
      if (error.status === 401) {

        // prevent multiple refresh calls
        if (isRefreshing) {
          return throwError(() => error);
        }

        isRefreshing = true;

        // 🔁 Call refreshToken from AuthService (NO parameters)
        return authService.refreshToken().pipe(

          switchMap((res: any) => {

            isRefreshing = false;

            // 💾 Save new access token
            localStorage.setItem('accessToken', res.accessToken);

            // 🔄 Retry original request
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(clonedRequest);
          }),

          catchError((err) => {

            isRefreshing = false;

            // ❌ refresh failed → logout from service
            authService.logOut();

            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};