import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../services/auth-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentStep = 1;
  userEmail = '';

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  });

  submit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
  
    this.authService.ForgotPassword(this.forgotPasswordForm.value).subscribe({
      next: () => {
        this.isLoading = false;
  
        this.userEmail = this.forgotPasswordForm.value.email;
  
        this.resetPasswordForm.patchValue({
          email: this.userEmail
        });
  
        this.currentStep = 2;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Something went wrong.';
      }
    });
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const formValue = this.resetPasswordForm.value;

    if (formValue.newPassword !== formValue.confirmNewPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.ResetPassword(formValue).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully.';
      
        console.log(res);
      
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Something went wrong.';
        console.error(err);
      }
    });
  }

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef>;

  updateOtp() {
    const values = Array.from(
      document.querySelectorAll('.otp-box')
    )
      .map((el: any) => el.value)
      .join('');
  
    this.resetPasswordForm.patchValue({
      otp: String(values)   // ✅ FORCE STRING
    });
  }

  moveNext(event: Event, nextInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
  
    input.value = input.value.replace(/[^0-9]/g, '');
  
    if (input.value && nextInput) {
      nextInput.focus();
    }
  
    this.updateOtp();
  }
  
  movePrev(event: KeyboardEvent, prevInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
  
    if (event.key === 'Backspace' && !input.value) {
      prevInput.focus();
    }
  
    this.updateOtp();
  }

  showNewPassword = false;
showConfirmPassword = false;

toggleNewPasswordVisibility() {
  this.showNewPassword = !this.showNewPassword;
}

toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
}