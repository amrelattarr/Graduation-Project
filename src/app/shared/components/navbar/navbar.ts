import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly notificationService = inject(NotificationService);

  isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('accessToken') ||
      !!localStorage.getItem('token')
    );
  }

  isVolunteer(): boolean {
    return localStorage.getItem('Role') === 'Volunteer';
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}