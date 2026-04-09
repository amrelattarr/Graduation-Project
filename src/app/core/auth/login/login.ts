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
      this.subscription.unsubscribe();
      this.subscription = this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
        },error: (err: any) => {
          console.error(err);
        }
      });
    } else {
      this.loginForm.setErrors({mismatch: true});
      this.loginForm.markAllAsTouched();
    }
  }

}
