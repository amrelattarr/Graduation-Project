import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl,FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
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
  
      foodType: ['', Validators.required], // dropdown
  
      unitType: ['', Validators.required], // Kilos | Meals
  
      quantity: [1, [Validators.required, Validators.min(1)]],
  
      preparedTime: ['', [Validators.required, this.preparedTimeValidator]],
  
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
  
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
  
      notes: ['']
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
    if (this.isSubmitting) return;
  
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = '';
  
    if (!this.selectedImage) {
      this.isSubmitting = false;
      this.errorMessage = 'Please select an image for the donation.';
      return;
    }
  
    const formValue = this.donationForm.value;
  
    const prepared = new Date(formValue.preparedTime);
  
    // ❗ optional safety check (recommended)
    if (isNaN(prepared.getTime())) {
      this.isSubmitting = false;
      this.errorMessage = 'Invalid prepared time';
      return;
    }
  
    const charityId = Number(formValue.charityId);
  
    const body = {
      foodType: formValue.foodType,
      unitType: formValue.unitType,
      quantity: Number(formValue.quantity),
      preparedTime: prepared.toISOString(),
      latitude: Number(formValue.latitude),
      longitude: Number(formValue.longitude),
      notes: formValue.notes ?? ''
    };
  
    this.donor.createDonation(
      charityId,
      body,
      this.selectedImage
    )
    .subscribe({
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