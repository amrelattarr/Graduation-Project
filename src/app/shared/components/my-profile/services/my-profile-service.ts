import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router)

  getprofile(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'Profile')
  }

  
  
}
