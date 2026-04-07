import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , CommonModule , RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder)

  subscription : Subscription = new Subscription();
  registerForm !: FormGroup

  ngOnInit(): void {
    this.initForm()
  }


  initForm(): void {
    this.registerForm = this.fb.group({
      fullName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      role: ['Donor' , Validators.required] 
    });
  }

  nameControl:any
  phoneControl:any
  emailControl:any
  passwordControl:any
  roleControl:any

  submit() {
    if(this.registerForm.valid) {
      this.subscription.unsubscribe();
      this.subscription = this.authService.registerForm(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
        },error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.registerForm.setErrors({mismatch: true});
      this.registerForm.markAllAsTouched();
    }
  }

}
