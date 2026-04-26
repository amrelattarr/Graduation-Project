import { CommonModule, Location } from '@angular/common';
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
import { LocationService } from '../../../../shared/services/location-service';
import { Map } from "../../../../shared/components/map/map";

@Component({
  selector: 'app-create-donation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Map],
  templateUrl: './create-donation.html',
  styleUrl: './create-donation.css',
})
export class CreateDonation {
  private readonly fb = inject(FormBuilder);
  private readonly donor = inject(Donor);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute)
  private readonly locationService = inject(LocationService);

  donationForm!: FormGroup;
  isMapOpen = false;


  selectedImage: File | null = null;
  imagePreview: string | null = null;

  charities: any[] = [];

  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();
    this.loadCharities();
  
    this.locationService.location$.subscribe(location => {
      if (location) {
        this.donationForm.patchValue({
          latitude: location.lat,
          longitude: location.lng
        });
      }
    });
  }

  initForm(): void {
    this.donationForm = this.fb.group({
      charityId: [null, Validators.required],
      foodType: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      preparedTime: ['', [Validators.required, this.preparedTimeValidator]],
      expirationTime: ['', [Validators.required, this.expirationTimeValidator]],
      latitude: [
        30.0444,
        [Validators.required, Validators.min(-90), Validators.max(90)]
      ],
      longitude: [
        31.2357,
        [Validators.required, Validators.min(-180), Validators.max(180)]
      ],
      notes: [''],
    });
  }

  preparedTimeValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const now = new Date();

    return selectedDate <= now
      ? null
      : { futurePreparedTime: true };
  }

  expirationTimeValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const now = new Date();

    return selectedDate > now
      ? null
      : { pastExpirationTime: true };
  }

  loadCharities(): void {
    this.donor.getCharities().subscribe({
      next: (res: any) => {
        this.charities = Array.isArray(res)
          ? res
          : (res.data ?? []);
      },
      error: (err) => {
        console.error(err);
        this.charities = [];
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = this.selectedImage
      ? URL.createObjectURL(this.selectedImage)
      : null;
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

    const charityId = Number(this.donationForm.value.charityId);

    const body = {
      foodType: this.donationForm.value.foodType,
      quantity: Number(this.donationForm.value.quantity),
      preparedTime: prepared.toISOString(),
      expirationTime: expiration.toISOString(),
      latitude: Number(this.donationForm.value.latitude),
      longitude: Number(this.donationForm.value.longitude),
      notes: this.donationForm.value.notes ?? '',
    };

    this.donor.createDonation(
      charityId,
      body,
      this.selectedImage
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/donor/my-donations']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;

        this.errorMessage =
          err?.error?.errors
            ? Object.values(err.error.errors).flat().join(' | ')
            : err?.error?.message || 'Create donation failed';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  // 🔥 open modal map
  openMap() {
    this.isMapOpen = true;
  }

  // 🔥 close modal map
  closeMap() {
    this.isMapOpen = false;
  }

  // 🔥 receive location from map
  onLocationSelected(event: { lat: number, lng: number }) {
    this.donationForm.patchValue({
      latitude: event.lat,
      longitude: event.lng
    });

    this.isMapOpen = false;
  }

}