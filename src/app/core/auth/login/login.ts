import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
   standalone: true,
  imports: [ReactiveFormsModule , CommonModule , RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder)

  subscription : Subscription = new Subscription();
  loginForm !: FormGroup
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.initForm()
  }


  initForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  submit() {
    if(this.loginForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      this.subscription.unsubscribe();
      this.subscription = this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          // Store token (assuming backend returns token in res.token or res.data.token)
          if (res.token) {
            localStorage.setItem('authToken', res.token);
          } else if (res.data && res.data.token) {
            localStorage.setItem('authToken', res.data.token);
          }
          this.successMessage = 'Login successful!';
          this.isLoading = false;
          // Redirect to profile
          this.router.navigate(['/profile']);
        },error: (err: any) => {
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.setErrors({mismatch: true});
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fix the form errors.';
    }
  }

}