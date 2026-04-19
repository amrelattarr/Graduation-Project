import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CharityService } from '../../services/charity.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly charityService = inject(CharityService);

  subscription: Subscription = new Subscription();
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.subscription.unsubscribe();

    this.subscription = this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {

        // ================= DEBUG =================
        console.log('🔥 LOGIN RESPONSE:', res);

        // ================= TOKEN EXTRACTION =================
        const token =
          res?.accessToken ??
          res?.token ??
          res?.data?.token ??
          '';

        if (!token) {
          console.error('❌ NO TOKEN RECEIVED FROM API', res);
          return;
        }

        // ================= DECODE TOKEN =================
        let payload: any = {};
        try {
          payload = JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          console.warn('⚠️ Token decode failed');
        }

        // ================= ROLE =================
        const role =
          payload?.role ||
          payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          res?.role ||
          res?.userRole ||
          '';

        // ================= SAVE =================
        this.authService.saveUserData(
          token,
          role,
          res?.profileCompleted ?? false
        );

        console.log('✅ TOKEN SAVED:', token);
        console.log('📦 localStorage token:', localStorage.getItem('token'));
        console.log('👤 ROLE:', role);

        // ================= CHARITY ADMIN FLOW =================
        if (role?.toLowerCase() === 'charityadmin') {

          const charityId = this.authService.getCharityId();

          // ❌ No charity yet → go create
          if (!charityId) {
            this.router.navigate(['/charity-admin/home']);
            return;
          }

          // ✅ Fetch status
          this.charityService.getCharityDetails(charityId).subscribe({
            next: (result: any) => {

              console.log('📊 CHARITY RESPONSE:', result);

              const status = result?.data?.status?.toLowerCase();

              console.log('📌 STATUS:', status);

              // ================= ROUTING =================

              if (status === 'approved') {
                this.router.navigate(['/charity-admin/details']);
              }

              else if (status === 'pending') {
                this.router.navigate(['/charity-admin/home'], {
                  queryParams: { status: 'pending' }
                });
              }

              else {
                this.router.navigate(['/charity-admin/home'], {
                  queryParams: { status: 'rejected' }
                });
              }
            },
            error: (err) => {
              console.error('❌ GET CHARITY ERROR:', err);
              this.router.navigate(['/charity-admin/home']);
            }
          });

        } else {
          // ================= OTHER USERS =================
          this.router.navigate(['/profile']);
        }
      },

      error: (err: any) => {
        console.error('❌ LOGIN ERROR:', err);
      }
    });
  }
}