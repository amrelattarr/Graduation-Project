import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  registerForm(data:object): Observable<any>{
    return this.httpClient.post(environment.baseUrl + "Authentication/Register", data)
  }
 createDonorProfile(data: object): Observable<any> {
  return this.httpClient.post(
    `${environment.baseUrl}Profile/donor`,
    data
  );
}

createVolunteerProfile(data: object): Observable<any> {
  return this.httpClient.post(
    `${environment.baseUrl}Profile/volunteer`,
    data
  );
}

  saveUserData(token: string, role: string, profileCompleted: boolean): void {
  const formattedRole =
    role.toLowerCase() === 'donor' ? 'Donor' :
    role.toLowerCase() === 'volunteer' ? 'Volunteer' :
    role;



  localStorage.setItem('token', token);
  localStorage.setItem('role', formattedRole);
  localStorage.setItem('profileCompleted', String(profileCompleted));
}
  getUserRole(): string | null {
    return localStorage.getItem('Role');
  }

  isProfileCompleted(): boolean {
    return localStorage.getItem('profileCompleted') === 'true';
  }

  setProfileCompleted(): void {
    localStorage.setItem('profileCompleted', 'true');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + "Authentication/Login", data);
  }

  logOut(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('Role');
    localStorage.removeItem('IsCompleted');
    this.router.navigate(['/login']);
  }
  
  forgotPassword(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + "Authentication/ForgotPassword", data);
  }
  
  changePassword(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + "Authentication/ChangePassword", data);
  }

  getCharityId(): number | null {
    const id = localStorage.getItem('charityId');
    return id ? Number(id) : null;
  }

  setCharityId(id: number): void {
    localStorage.setItem('charityId', id.toString());
  }
}
