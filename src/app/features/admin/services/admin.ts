import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  getCharties(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Admin/Charities/List')
  }

  verifyCharity(id: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `Admin/Charities/${id}/Verify` , {})
  }

  deActivateCharity(id: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `Admin/Charities/${id}/Deactivate` , {})
  }

  reActivateCharity(id: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `Admin/Charities/${id}/Reactivate` , {})
  }
  
}
