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
    // 1️⃣ get role safely
    this.role = this.authService.getUserRole();
    const normalizedRole = (this.role ?? '').toLowerCase();

    // 2️⃣ init form FIRST (prevents NG01052)
    this.initForm(normalizedRole);

    // 3️⃣ redirect if CharityAdmin
    if (normalizedRole === 'charityadmin') {
      this.router.navigate(['/charity-admin']);
      return;
    }
  }

  initForm(role: string): void {

    const latValidators = [
      Validators.required,
      Validators.min(-90),
      Validators.max(90)
    ];

    const lngValidators = [
      Validators.required,
      Validators.min(-180),
      Validators.max(180)
    ];

    if (role === 'donor') {

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

    } else if (role === 'volunteer') {

      this.profileForm = this.fb.group({
        location: this.fb.group({
          latitude: [null, latValidators],
          longitude: [null, lngValidators]
        }),
        address: [null, Validators.required],
        vehicleType: [null, Validators.required]
      });

    } else {

      // 🔥 safe fallback (prevents crash)
      this.profileForm = this.fb.group({});
    }
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }

  submit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const currentRole = this.role?.toLowerCase();

    if (currentRole === 'donor') {

      const donorData = { ...this.profileForm.value };

      if (!donorData.isBusiness) {
        donorData.businessType = '';
      }

      this.authService.createDonorProfile(donorData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('Donor Profile Error:', err)
      });

    } else if (currentRole === 'volunteer') {

      this.authService.createVolunteerProfile(this.profileForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('Volunteer Profile Error:', err)
      });
    }
  }

  private handleSuccess(): void {
    this.authService.setProfileCompleted();
    this.router.navigate(['/']);
  }

  // getters
  get isBusiness() { return this.profileForm.get('isBusiness'); }
  get address() { return this.profileForm.get('address'); }
  get vehicleType() { return this.profileForm.get('vehicleType'); }
  get latitude() { return this.profileForm.get('location.latitude'); }
  get longitude() { return this.profileForm.get('location.longitude'); }
  get businessType() { return this.profileForm.get('businessType'); }
}