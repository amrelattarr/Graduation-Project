import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder)

  subscription : Subscription = new Subscription();
  changeForm !: FormGroup

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.changeForm = this.fb.group({
      currentPassword: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      newPassword: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmNewPassword: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    });
  }

  confirmPassword(group: AbstractControl) {
    if(group.get('newPassword')?.value === group.get('confirmNewPassword')?.value) {
      return null;
    } else {
      group.get('confirmNewPassword')?.setErrors({mismatch: true});
      return {mismatch: true};
    }
  }

  submit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }
  
    this.authService.changePassword(this.changeForm.value).subscribe({
      next: (res) => {
        console.log('Success response:', res);
        this.authService.logOut();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error response:', err);
      }
    });
  }

}
