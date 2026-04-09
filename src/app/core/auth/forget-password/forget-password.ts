import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  subscription: Subscription = new Subscription();
  forgotForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.forgotForm.valid) {
      this.subscription.unsubscribe();
      this.subscription = this.authService.forgotPassword(this.forgotForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    } else {
      this.forgotForm.setErrors({ mismatch: true });
      this.forgotForm.markAllAsTouched();
    }
  }
}
