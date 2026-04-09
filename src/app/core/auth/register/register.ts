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

  submit(): void {
  if (this.registerForm.invalid) {
    console.log('Form is invalid');
    console.log('fullName errors:', this.registerForm.get('fullName')?.errors);
    console.log('phone errors:', this.registerForm.get('phone')?.errors);
    console.log('email errors:', this.registerForm.get('email')?.errors);
    console.log('password errors:', this.registerForm.get('password')?.errors);
    console.log('role errors:', this.registerForm.get('role')?.errors);

    this.registerForm.markAllAsTouched();
    return;
  }

  this.subscription.unsubscribe();
  this.subscription = this.authService.registerForm(this.registerForm.value).subscribe({
   next: (res) => {
  console.log('Success response:', res);

  // 1. Try every common property name for a token
  const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken;
  
  // 2. Safely capture the role
  const role = this.registerForm.value.role;

  if (token) {
    // 3. Save to LocalStorage
    this.authService.saveUserData(
      token, 
      role, 
      res.profileCompleted ?? false
    );

    // 4. Navigation
    if (role.toLowerCase() === 'charityadmin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/profile']);
    }
  } else {
    // If this triggers, look at your Console and see what 'res' actually contains
    console.error('CRITICAL: Token not found in response. Check the naming in Console.');
  }
}
  });
}
//   submit() {
//     if(this.registerForm.valid) {
//       this.subscription.unsubscribe();
//       this.subscription = this.authService.registerForm(this.registerForm.value).subscribe({
//         // next: (res) => {
//         //   console.log(res);
//         // },
//         // 
//         next: (res) => {
//   console.log(res);

//   this.authService.saveUserData(
//     res.token,
//     res.role,
//     res.profileCompleted
//   );

//   if (!res.profileCompleted) {
//     this.router.navigate(['/profile']);
//   } else {
//     this.router.navigate(['/']);
//   }
// },error: (err) => {
//           console.error(err);
//         }
//       });
//     } else {
//       this.registerForm.setErrors({mismatch: true});
//       this.registerForm.markAllAsTouched();
//     }
//   }

}
