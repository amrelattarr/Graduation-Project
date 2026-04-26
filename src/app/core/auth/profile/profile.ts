import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  profileForm!: FormGroup;
  role: string | null = null;

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    
    // Redirect Charity Admins immediately
    if (this.role?.toLowerCase() === 'charityadmin') {
      this.router.navigate(['/dashboard']); // Redirect to their specific dashboard
      return;
    }

    this.initForm();
  }

  initForm(): void {
    const latValidators = [Validators.required, Validators.min(-90), Validators.max(90)];
    const lngValidators = [Validators.required, Validators.min(-180), Validators.max(180)];

    if (this.role === 'Donor') {
      this.profileForm = this.fb.group({
        isBusiness: [null, Validators.required],
        businessType: [null],
        location: this.fb.group({
          latitude: [null, latValidators],
          longitude: [null, lngValidators]
        }),
        address: [null, Validators.required]
      });

      this.profileForm.get('isBusiness')?.valueChanges.subscribe(value => {
        const typeControl = this.profileForm.get('businessType');
        if (value === true) {
          typeControl?.setValidators([Validators.required]);
        } else {
          typeControl?.clearValidators();
        }
        typeControl?.updateValueAndValidity();
      });

    } else if (this.role === 'Volunteer') {
      this.profileForm = this.fb.group({
        location: this.fb.group({
          latitude: [null, latValidators],
          longitude: [null, lngValidators]
        }),
        address: [null, Validators.required],
        vehicleType: [null, Validators.required]
      });
    } else {
      // Fallback for roles that shouldn't be here
      this.profileForm = this.fb.group({});
    }
  }

  goBack(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('Role');
    localStorage.removeItem('IsCompleted');
    this.router.navigate(['/login']);
  }

submit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  // Use a trimmed, standardized version of the role for the check
  const currentRole = this.role?.trim();

  if (currentRole === 'Donor') {
    const donorData = { ...this.profileForm.value };
    if (!donorData.isBusiness) {
      donorData.businessType = '';
    }

    this.authService.createDonorProfile(donorData).subscribe({
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Donor Profile Error:', err)
    });

  } else if (currentRole === 'Volunteer') {
    this.authService.createVolunteerProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/volunteer-home']);
      },
      error: (err) => console.error('Volunteer Profile Error:', err)
    });
  }
}

  // Getters for Template
  get isBusiness() { return this.profileForm.get('isBusiness'); }
  get address() { return this.profileForm.get('address'); }
  get vehicleType() { return this.profileForm.get('vehicleType'); }
  get latitude() { return this.profileForm.get('location.latitude'); }
  get longitude() { return this.profileForm.get('location.longitude'); }
  get businessType() { return this.profileForm.get('businessType'); }
}