import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  getDashboardData() :Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Dashboard/stats');
  }

  getReportData(filters: any): Observable<any> {
    let params = new HttpParams();

    if (filters.from)     params = params.set('From', filters.from);
    if (filters.to)       params = params.set('To', filters.to);
    if (filters.unitType) params = params.set('UnitType', filters.unitType);
    if (filters.foodType) params = params.set('FoodType', filters.foodType);

    return this.httpClient.get(environment.baseUrl + 'DonationReport/ByUnitType', { params });
  }
}
