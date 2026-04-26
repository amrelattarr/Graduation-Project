import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment.development';
import { CreateCharityRequest, ApiResponse, UpdateCharityInfoRequest, UpdateCharityLocationRequest, Donation, Volunteer, Charity, PendingCharityDonation, RejectDonationRequest } from '../interfaces/charity-admin-interface';


@Injectable({
  providedIn: 'root',
})
export class CharityService {
  private readonly httpClient = inject(HttpClient);

  // ================= CREATE =================
  createCharity(data: CreateCharityRequest): Observable<ApiResponse<Charity>> {
    return this.httpClient
      .post<Charity>(
        `${environment.baseUrl}Charity/CreateMyCharity`,
        data
      )
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= LIST =================
  getCharityList(): Observable<ApiResponse<Charity[]>> {
    return this.httpClient
      .get<Charity[]>(
        `${environment.baseUrl}Charity/List`
      )
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= DETAILS =================
  getCharityDetails(charityId: number): Observable<ApiResponse<Charity>> {
    return this.httpClient
      .get<Charity>(
        `${environment.baseUrl}Charity/Details/${charityId}`
      )
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= UPDATE INFO =================
  updateCharityInfo(
    data: UpdateCharityInfoRequest
  ): Observable<ApiResponse<Charity>> {
    return this.httpClient
      .put<Charity>(
        `${environment.baseUrl}Charity/UpdateCharityInfo`,
        data
      )
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= UPDATE LOCATION =================
  updateCharityLocation(
    data: UpdateCharityLocationRequest
  ): Observable<ApiResponse<Charity>> {
    return this.httpClient
      .put<Charity>(
        `${environment.baseUrl}Charity/UpdateCharityLocation`,
        data
      )
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= REQUESTS =================
  getRequests(): Observable<ApiResponse<Request[]>> {
    return this.httpClient
      .get<Request[]>(`${environment.baseUrl}Request`)
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= DONATIONS =================
  getDonations(): Observable<ApiResponse<Donation[]>> {
    return this.httpClient
      .get<Donation[]>(`${environment.baseUrl}Donation`)
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= VOLUNTEERS =================
  getVolunteers(): Observable<ApiResponse<Volunteer[]>> {
    return this.httpClient
      .get<Volunteer[]>(`${environment.baseUrl}Volunteer`)
      .pipe(
        map((res) => ({ success: true, data: res })),
        catchError(this.handleError)
      );
  }

  // ================= CHARITY DONATIONS =================
getPendingDonations(): Observable<ApiResponse<PendingCharityDonation[]>> {
  return this.httpClient
    .get<PendingCharityDonation[]>(
      `${environment.baseUrl}Charity/Donations/Pending`
    )
    .pipe(
      map((res) => ({ success: true, data: res })),
      catchError(this.handleError)
    );
}

acceptDonation(donationId: number): Observable<ApiResponse<boolean>> {
  return this.httpClient
    .post<boolean>(
      `${environment.baseUrl}Charity/Donations/Accept/${donationId}`,
      {}
    )
    .pipe(
      map((res) => ({ success: true, data: res })),
      catchError(this.handleError)
    );
}

rejectDonation(
  donationId: number,
  data: RejectDonationRequest
): Observable<ApiResponse<boolean>> {
  return this.httpClient
    .post<boolean>(
      `${environment.baseUrl}Charity/Donations/Reject/${donationId}`,
      data
    )
    .pipe(
      map((res) => ({ success: true, data: res })),
      catchError(this.handleError)
    );
}

markDonationExpired(donationId: number): Observable<ApiResponse<boolean>> {
  return this.httpClient
    .post<boolean>(
      `${environment.baseUrl}Charity/Donations/MarkExpired/${donationId}`,
      {}
    )
    .pipe(
      map((res) => ({ success: true, data: res })),
      catchError(this.handleError)
    );
}


  //================== PICK-UP TASKS ==================

  getAcceptedUnassignedDonations(): Observable<any> {
  return this.httpClient.get(
    `${environment.baseUrl}Charity/Donations/Accepted-Unassigned`
  );
}

createPickupTask(donationId: number, slaDueAt: string): Observable<any> {
  return this.httpClient.post(
    `${environment.baseUrl}Charity/PickupTasks/Create/${donationId}`,
    { slaDueAt }
  );
}

getOpenPickupTasks(): Observable<any> {
  return this.httpClient.get(
    `${environment.baseUrl}Charity/PickupTasks/Open`
  );
}
  // ================= ERROR HANDLING =================
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API ERROR:', error);

    return throwError(() => ({
      success: false,
      message:
        error.error?.message ||
        error.message ||
        'An unexpected error occurred',
      statusCode: error.status,
    }));
  }

  displayAllpendingRequests(charityId: number): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `VolunteerMembership/7/pending`)
  }

  approveVolunteerRequest(Id: number): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `VolunteerMembership/Approve/${Id}`, {})
  }

  rejectVolunteerRequest(Id: number): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `VolunteerMembership/reject/${Id}`, {})
  }

  displayAllApprovedVolunteers(charityId: number): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `VolunteerMembership/7/memberships`)
  }

  suspendVolunter(Id: number): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `VolunteerMembership/suspend/${Id}`, {})
  }

  ActivateVolunter(Id: number): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `VolunteerMembership/reactivate/${Id}`, {})
  }
}