import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth-service';
import { CharityService } from '../../features/charity-admin/services/charity';
import { MyProfileService } from '../../shared/components/my-profile/services/my-profile-service';
import { catchError, map, of, switchMap } from 'rxjs';

export const charityApprovalGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const charityService = inject(CharityService);
  const profileService = inject(MyProfileService);

  const isCharityHome = state.url.split('?')[0] === '/charity-admin-home';

  const checkApproval = (charityId: number) =>
    charityService.getCharityDetails(charityId).pipe(
      map((res: any) => {
        const charity = res?.data;
        const status = String(
          charity?.membershipStatus ?? charity?.status ?? ''
        ).toLowerCase();
        const isApproved =
          status === 'approved' || charity?.isVerified === true;

        if (isApproved || isCharityHome) {
          return true;
        }

        return router.parseUrl('/charity-admin-home');
      }),
      catchError(() =>
        of(
          isCharityHome
            ? true
            : router.parseUrl('/charity-admin-home')
        )
      )
    );

  const storedCharityId = authService.getCharityId();

  if (storedCharityId) {
    return checkApproval(storedCharityId);
  }

  return profileService.getprofile().pipe(
    switchMap((res: any) => {
      const profile = res?.data ?? res;
      const charityId = Number(profile?.charityAdmin?.charityId);

      if (!Number.isFinite(charityId) || charityId <= 0) {
        return of(
          isCharityHome
            ? true
            : router.parseUrl('/charity-admin-home')
        );
      }

      authService.setCharityId(charityId);
      return checkApproval(charityId);
    }),
    catchError(() =>
      of(
        isCharityHome
          ? true
          : router.parseUrl('/charity-admin-home')
      )
    )
  );
};

