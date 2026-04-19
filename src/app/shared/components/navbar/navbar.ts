import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }


  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

}
