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


  
}
