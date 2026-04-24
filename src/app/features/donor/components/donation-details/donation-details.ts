import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Donation, DonationStatus } from '../../interfaces/donation';
import { Donor } from '../../services/donor';

@Component({
  selector: 'app-donation-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './donation-details.html',
  styleUrl: './donation-details.css',
})
export class DonationDetails {
  private readonly donor = inject(Donor);
  private readonly route = inject(ActivatedRoute);

  donation!: Donation;
  track!: DonationStatus;
  donationId!: number;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.donationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetails();
    this.loadTracking();
  }

  loadDetails(): void {
    this.isLoading = true;

    this.donor.getDonationDetails(this.donationId).subscribe({
      next: (res: any) => {
        this.donation = res.data ?? res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load donation details';
        this.isLoading = false;
      }
    });
  }

  loadTracking(): void {
    this.donor.trackDonationStatus(this.donationId).subscribe({
      next: (res: any) => {
        this.track = res.data ?? res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  isDone(value?: string): boolean {
    return !!value;
  }
}