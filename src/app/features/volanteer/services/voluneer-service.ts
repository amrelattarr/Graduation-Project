import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface VolunteerPickupOffer {
  taskId: number;
  donationId: number;
  donationTitle: string;
  charityName: string;
  offeredAt: string;
  slaDueAt: string;
  response: string;
  status?: string;
  pictureUrl?: string;
  donationPictureUrl?: string;
  donationImageUrl?: string;
  imageUrl?: string;
  resolvedPictureUrl?: string;
  donation?: {
    pictureUrl?: string;
    imageUrl?: string;
  };
}

export interface VolunteerPickupHistory {
  taskId: number;
  donationId: number;
  donationTitle: string;
  charityName: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export enum VolunteerAvailabilityStatus {
  Offline = 0,
  Available = 1,
  Busy = 2,
}

@Injectable({
  providedIn: 'root',
})
export class VoluneerService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly manualStatusKey = 'volunteerManualAvailability';
  private readonly availabilitySubject =
    new BehaviorSubject<VolunteerAvailabilityStatus>(
      this.getStoredManualStatus()
    );

  readonly availability$ = this.availabilitySubject.asObservable();

  get currentAvailability(): VolunteerAvailabilityStatus {
    return this.availabilitySubject.value;
  }

  getCharties(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Charity/List');
  }

  applybyCharityId(charityId: number): Observable<any> {
    return this.httpClient.post( environment.baseUrl + `VolunteerMembership/apply/${charityId}`, {});
  }

  getMyMemberships(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'VolunteerMembership/my-membership');
  }

  updateVolunteerStatus(
    status: VolunteerAvailabilityStatus,
    rememberAsManual = true
  ): Observable<any> {
    return this.httpClient.patch(
      environment.baseUrl + 'Profile/volunteer/status',
      { status }
    ).pipe(
      tap(() => {
        this.availabilitySubject.next(status);

        if (rememberAsManual && status !== VolunteerAvailabilityStatus.Busy) {
          localStorage.setItem(this.manualStatusKey, String(status));
        }
      })
    );
  }

  loadVolunteerStatus(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Profile').pipe(
      tap((response: any) => {
        const status = this.parseAvailabilityStatus(
          response?.volunteer?.status ?? response?.data?.volunteer?.status
        );

        if (status !== null) {
          this.availabilitySubject.next(status);

          if (status !== VolunteerAvailabilityStatus.Busy) {
            localStorage.setItem(this.manualStatusKey, String(status));
          }
        }
      })
    );
  }

  setBusyForActiveTask(hasActiveTask: boolean): Observable<any> | null {
    const targetStatus = hasActiveTask
      ? VolunteerAvailabilityStatus.Busy
      : this.getStoredManualStatus(VolunteerAvailabilityStatus.Available);

    if (this.currentAvailability === targetStatus) {
      return null;
    }

    return this.updateVolunteerStatus(targetStatus, false);
  }

  // ================= PICKUP TASKS =================

  getPickupOffers(): Observable<VolunteerPickupOffer[]> {
    return this.httpClient.get<VolunteerPickupOffer[]>(
      environment.baseUrl + 'Volunteer/PickupTasks/Offers'
    );
  }

  acceptPickupTask(taskId: number): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Accept/${taskId}`,
      {}
    );
  }

  rejectPickupTask(taskId: number): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Reject/${taskId}`,
      {}
    );
  }

  cancelPickupTask(taskId: number): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Cancel/${taskId}`,
      {}
    );
  }

  startPickupTask(taskId: number): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Start/${taskId}`,
      {}
    );
  }

  completePickupTask(taskId: number): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Complete/${taskId}`,
      {}
    );
  }

  getPickupHistory(): Observable<VolunteerPickupHistory[]> {
    return this.httpClient.get<VolunteerPickupHistory[]>(
      environment.baseUrl + 'Volunteer/PickupTasks/History'
    );
  }

  makeInspection(taskId: number, approved: boolean, Areason: string): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `Volunteer/PickupTasks/Inspect/${taskId}`,
      {
        isApproved: approved,
        reason: Areason
      }
    );
  }

  private getStoredManualStatus(
    fallback = VolunteerAvailabilityStatus.Offline
  ): VolunteerAvailabilityStatus {
    const storedStatus = Number(localStorage.getItem(this.manualStatusKey));

    return storedStatus === VolunteerAvailabilityStatus.Available ||
      storedStatus === VolunteerAvailabilityStatus.Offline
      ? storedStatus
      : fallback;
  }

  private parseAvailabilityStatus(
    status: unknown
  ): VolunteerAvailabilityStatus | null {
    if (typeof status === 'number' && status >= 0 && status <= 2) {
      return status;
    }

    const normalizedStatus = String(status ?? '').trim().toLowerCase();

    if (normalizedStatus === 'offline' || normalizedStatus === '0') {
      return VolunteerAvailabilityStatus.Offline;
    }

    if (
      normalizedStatus === 'available' ||
      normalizedStatus === 'online' ||
      normalizedStatus === '1'
    ) {
      return VolunteerAvailabilityStatus.Available;
    }

    if (normalizedStatus === 'busy' || normalizedStatus === '2') {
      return VolunteerAvailabilityStatus.Busy;
    }

    return null;
  }
}
