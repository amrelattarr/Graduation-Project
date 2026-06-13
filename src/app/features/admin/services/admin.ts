import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Charity } from '../interfaces/charity';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly httpClient = inject(HttpClient);

  getCharities(): Observable<{ data: Charity[] }> {
    return this.httpClient.get<{ data: Charity[] }>(
      `${environment.baseUrl}Admin/Charities/List`
    );
  }

  verifyCharity(id: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}Admin/Charities/${id}/Verify`,
      {}
    );
  }

  deactivateCharity(id: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}Admin/Charities/${id}/Deactivate`,
      {}
    );
  }

  reactivateCharity(id: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}Admin/Charities/${id}/Reactivate`,
      {}
    );
  }
}