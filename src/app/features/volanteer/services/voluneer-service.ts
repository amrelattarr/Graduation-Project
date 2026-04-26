import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VoluneerService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  

  getCharties(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Charity/List');
  }

  applybyCharityId(charityId: number): Observable<any> {
    return this.httpClient.post( environment.baseUrl + `VolunteerMembership/apply/${charityId}`, {});
  }

  getMyMemberships(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'VolunteerMembership/my-membership');
  }

  // ================= PICKUP TASKS =================

  getPickupOffers(): Observable<any> {
    return this.httpClient.get(
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

  getPickupHistory(): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + 'Volunteer/PickupTasks/History'
    );
  }


  
}
