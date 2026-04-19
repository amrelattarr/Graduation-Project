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

  // ================= AUTH =================

  registerForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}Authentication/Register`,
      data
    );
  }

  login(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}Authentication/Login`,
      data
    );
  }

  forgotPassword(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}Authentication/ForgotPassword`,
      data
    );
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}Authentication/ChangePassword`,
      data
    );
  }

  // ================= PROFILE =================

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

  // ================= STORAGE =================

  saveUserData(token: string, role: string, profileCompleted: boolean): void {

    if (!token || token === 'undefined' || token === 'null') {
      console.error('❌ Invalid token not saved');
      return;
    }

    localStorage.setItem('token', token.trim());

    const normalizedRole = role?.toLowerCase().replace(/\s/g, '');

    localStorage.setItem('role', normalizedRole || '');
    localStorage.setItem('profileCompleted', String(profileCompleted));
  }

  // ✅ FIXED: missing method
  setProfileCompleted(): void {
    localStorage.setItem('profileCompleted', 'true');
  }

  isProfileCompleted(): boolean {
    return localStorage.getItem('profileCompleted') === 'true';
  }

  // ================= TOKEN =================

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  }

  // ================= ROLE =================

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // ================= CHARITY =================

  getCharityId(): number | null {
    const id = localStorage.getItem('charityId');
    return id ? Number(id) : null;
  }

  setCharityId(id: number): void {
    localStorage.setItem('charityId', id.toString());
  }

  // ================= LOGOUT =================

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}