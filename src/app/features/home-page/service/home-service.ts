import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router)
  
  sliderStatstics() : Observable <any>{
    return this.httpClient.get(environment.baseUrl + "Home/impact-statistics");
  }
}
