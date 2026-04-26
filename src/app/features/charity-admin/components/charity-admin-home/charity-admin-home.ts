import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize, interval, switchMap, forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { ApiResponse, Charity, UpdateCharityInfoRequest, UpdateCharityLocationRequest } from '../../interfaces/charity-admin-interface';
import { CharityService } from '../../services/charity';
import { CommonModule } from '@angular/common';

type CharityStatus = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-charity-admin-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './charity-admin-home.html',
  styleUrl: './charity-admin-home.css',
})
export class CharityAdminHome {
  private readonly charityService = inject(CharityService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  charityForm!: FormGroup;

  status: CharityStatus | null = null;
  isEditMode = false;
  currentCharityId: number | null = null;

  isLoading = false;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  private subs = new Subscription();
  private pollSub?: Subscription;

  // ================= GETTERS =================

  get isApproved(): boolean {
    return this.status === 'approved';
  }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isRejected(): boolean {
    return this.status === 'rejected';
  }

  get hasNoCharity(): boolean {
    return !this.isEditMode;
  }

  // ================= INIT =================

  ngOnInit(): void {
    this.initForm();
    this.loadCharity();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.pollSub?.unsubscribe();
  }

  // ================= FORM =================

  private initForm(): void {
    this.charityForm = this.fb.group({
      organizationName: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorate: ['', Validators.required],
      latitude: [30.0444, Validators.required],
      longitude: [31.2357, Validators.required],
    });
  }

  // ================= LOAD =================

  loadCharity(): void {

    const id = this.authService.getCharityId();

    if (!id) {
      this.isEditMode = false;
      return;
    }

    this.isLoading = true;
    this.isEditMode = true;
    this.currentCharityId = id;

    const sub = this.charityService.getCharityDetails(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: ApiResponse<Charity>) => {

          if (!res.success || !res.data) return;

          console.log('📥 CHARITY RESPONSE:', res);

          this.status = (res.data as any).membershipStatus?.toLowerCase();

          this.charityForm.patchValue(res.data);

          if (this.status === 'approved') {
            this.router.navigate(['/charity-admin/details']);
          }

          if (this.status === 'pending') {
            this.startPolling(id);
          }
        },
        error: (err) => {
          console.log('🔥 LOAD ERROR:', err);
          this.status = null;
        }
      });

    this.subs.add(sub);
  }

  // ================= POLLING =================

  private startPolling(id: number): void {

    this.pollSub?.unsubscribe();

    this.pollSub = interval(5000)
      .pipe(
        switchMap(() => this.charityService.getCharityDetails(id))
      )
      .subscribe({
        next: (res: any) => {

          console.log('🔄 POLLING RESPONSE:', res);

          const status = res?.data?.membershipStatus?.toLowerCase();
          this.status = status;

          if (status === 'approved') {
            this.pollSub?.unsubscribe();
            this.router.navigate(['/charity-admin/details']);
          }

          if (status === 'rejected') {
            this.pollSub?.unsubscribe();
            this.errorMessage = '❌ Your charity was rejected.';
          }
        },
        error: (err) => {
          console.log('🔥 POLLING ERROR:', err);
        }
      });
  }

  // ================= SUBMIT =================

  onSubmit(): void {

    if (this.charityForm.invalid) return;

    this.isSubmitting = true;

    if (!this.isEditMode) {

      const body = {
        organizationName: this.charityForm.value.organizationName,
        licenseNumber: this.charityForm.value.licenseNumber,
        address: this.charityForm.value.address,
        city: this.charityForm.value.city,
        governorate: this.charityForm.value.governorate,
        latitude: Number(this.charityForm.value.latitude),
        longitude: Number(this.charityForm.value.longitude),
      };

      console.log('🚀 REQUEST BODY:', body);

      const sub = this.charityService.createCharity(body)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: (res: any) => {

            console.log('✅ SUCCESS RESPONSE:', res);

            const id = res?.data?.charityId || res?.data?.id;

            if (id) {
              this.authService.setCharityId(id);
            }

            this.currentCharityId = id;
            this.isEditMode = true;
            this.status = 'pending';

            this.startPolling(id);
          },

          error: (err) => {

            console.log('🔥 FULL ERROR OBJECT:', err);
            console.log('🔥 STATUS:', err.status);
            console.log('🔥 ERROR BODY:', err.error);
            console.log('🔥 VALIDATION ERRORS:', err?.error?.errors);

            if (err?.error?.errors) {
              Object.keys(err.error.errors).forEach(key => {
                console.log(`❌ ${key}:`, err.error.errors[key]);
              });
            }

            this.errorMessage =
              err?.error?.errors
                ? Object.values(err.error.errors).flat().join(' | ')
                : err?.error?.message || 'Create failed';
          }
        });

      this.subs.add(sub);
    }
else if (this.currentCharityId) {
  const info: UpdateCharityInfoRequest = {
    organizationName: this.charityForm.value.organizationName,
    licenseNumber: this.charityForm.value.licenseNumber,
  };

  const location: UpdateCharityLocationRequest = {
    latitude: Number(this.charityForm.value.latitude),
    longitude: Number(this.charityForm.value.longitude),
    address: this.charityForm.value.address,
    city: this.charityForm.value.city,
    governorate: this.charityForm.value.governorate,
  };


  forkJoin({
    info: this.charityService.updateCharityInfo(info),
    location: this.charityService.updateCharityLocation(location),
  })
  .pipe(finalize(() => this.isSubmitting = false))
  .subscribe({
    next: () => {
      this.successMessage = 'Updated successfully 🎉';
    },
    error: (err) => {
      console.log('🔥 UPDATE ERROR:', err);
      this.errorMessage = err?.error?.message || 'Update failed';
    }
  });
}
}

}
