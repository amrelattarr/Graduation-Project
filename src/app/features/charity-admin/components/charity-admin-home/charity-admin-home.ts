import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subscription,
  finalize,
  interval,
  switchMap,
  forkJoin,
} from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth-service';
import {
  ApiResponse,
  Charity,
  UpdateCharityInfoRequest,
  UpdateCharityLocationRequest,
} from '../../interfaces/charity-admin-interface';
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

  // ================= GETTERS (RESTORED - FIX FOR YOUR ERROR) =================

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
  this.errorMessage = '';
  this.successMessage = '';

  const id = this.authService.getCharityId();

  if (!id) {
    this.isEditMode = false;
    this.status = null;
    return;
  }

  this.isLoading = true;

  this.charityService.getCharityDetails(id)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res) => {
        if (!res?.success || !res.data) {
          this.authService.clearCharityId();
          this.currentCharityId = null;
          this.isEditMode = false;
          this.status = null;
          return;
        }

        const charity = res.data as any;
        const location = charity.location ?? {};
        const status = String(
          charity.membershipStatus ?? charity.status ?? ''
        ).toLowerCase() as CharityStatus;

        this.currentCharityId = id;
        this.isEditMode = true;
        this.status = status;
        this.charityForm.patchValue({
          organizationName: charity.organizationName ?? '',
          licenseNumber: charity.licenseNumber ?? '',
          address: charity.address ?? location.address ?? '',
          city: charity.city ?? location.city ?? '',
          governorate: charity.governorate ?? location.governorate ?? '',
          latitude: charity.latitude ?? location.latitude ?? 30.0444,
          longitude: charity.longitude ?? location.longitude ?? 31.2357,
        });

        // 🔴 BLOCK ACCESS IF NOT APPROVED
        if (status === 'pending') {
          this.startPolling(id);
          return;
        }

        if (status === 'rejected') {
          this.isEditMode = false;
          this.errorMessage = '❌ Your charity was rejected by admin.';
          return;
        }

        if (status === 'approved') {
          this.isEditMode = true;

          this.router.navigate(['/charity-admin/details']);
        }
      },

      error: () => {
        this.currentCharityId = null;
        this.isEditMode = false;
        this.status = null;
      }
    });
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
          const status =
            res?.data?.membershipStatus?.toLowerCase();

          this.status = status;

          if (status === 'approved') {
            this.pollSub?.unsubscribe();
            this.router.navigate(['/charity-admin/details']);
          }

          if (status === 'rejected') {
            this.pollSub?.unsubscribe();
            this.errorMessage =
              '❌ Your charity was rejected.';
          }
        },
        error: (err: any) => {
          console.log('🔥 POLLING ERROR:', err);
        },
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

      const sub = this.charityService
        .createCharity(body)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (res: any) => {
            const id =
              res?.data?.charityId || res?.data?.id;

            if (!id) {
              this.errorMessage =
                'Failed to get charity ID from server.';
              return;
            }

            this.authService.setCharityId(id);

            this.currentCharityId = id;
            this.isEditMode = true;
            this.status = 'pending';

            this.startPolling(id);
          },

          error: (err: any) => {
            console.log('🔥 CREATE ERROR:', err);
            this.errorMessage =
              err?.error?.message || 'Create failed';
          },
        });

      this.subs.add(sub);
    } else if (this.currentCharityId) {
      const info: UpdateCharityInfoRequest = {
        organizationName:
          this.charityForm.value.organizationName,
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
        location:
          this.charityService.updateCharityLocation(location),
      })
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.successMessage =
              'Updated successfully 🎉';
          },
          error: (err: any) => {
            console.log('🔥 UPDATE ERROR:', err);
            this.errorMessage =
              err?.error?.message || 'Update failed';
          },
        });
    }
  }
}
