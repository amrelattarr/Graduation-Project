import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Donor } from '../../services/donor';

@Component({
  selector: 'app-edit-donation',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-donation.html',
  styleUrl: './edit-donation.css',
})
export class EditDonation {
  private readonly fb = inject(FormBuilder);
  private readonly donor = inject(Donor);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  donationForm!: FormGroup;
  donationId!: number;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.donationId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadDonation();
  }

  initForm(): void {
    this.donationForm = this.fb.group({
      foodType: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      preparedTime: ['', [Validators.required, this.preparedTimeValidator]],
      expirationTime: ['', [Validators.required, this.expirationTimeValidator]],
      latitude: [30.0444, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [31.2357, [Validators.required, Validators.min(-180), Validators.max(180)]],
      notes: [''],
    });
  }

  preparedTimeValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const now = new Date();

    return selectedDate <= now ? null : { futurePreparedTime: true };
  }

  expirationTimeValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const now = new Date();

    return selectedDate > now ? null : { pastExpirationTime: true };
  }

  loadDonation(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.donor.getDonationDetails(this.donationId).subscribe({
      next: (res: any) => {
        const donation = res.data ?? res;

        this.donationForm.patchValue({
          foodType: donation.foodType,
          quantity: donation.quantity,
          preparedTime: this.toDateTimeLocal(donation.preparedTime),
          expirationTime: this.toDateTimeLocal(donation.expirationTime),
          latitude: donation.latitude,
          longitude: donation.longitude,
          notes: donation.notes ?? '',
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load donation details';
        this.isLoading = false;
      }
    });
  }

  submit(): void {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    const prepared = new Date(this.donationForm.value.preparedTime);
    const expiration = new Date(this.donationForm.value.expirationTime);

    if (expiration <= prepared) {
      this.errorMessage = 'Expiration time must be after prepared time';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const body = {
      foodType: this.donationForm.value.foodType,
      quantity: Number(this.donationForm.value.quantity),
      preparedTime: new Date(this.donationForm.value.preparedTime).toISOString(),
      expirationTime: new Date(this.donationForm.value.expirationTime).toISOString(),
      latitude: Number(this.donationForm.value.latitude),
      longitude: Number(this.donationForm.value.longitude),
      notes: this.donationForm.value.notes ?? '',
    };

    this.donor.editDonation(this.donationId, body).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Donation updated successfully';
        this.router.navigate(['/donor/my-donations']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;

        this.errorMessage =
          err?.error?.errors
            ? Object.values(err.error.errors).flat().join(' | ')
            : err?.error?.message || 'Edit donation failed';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/donor/my-donations']);
  }

  private toDateTimeLocal(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }
}