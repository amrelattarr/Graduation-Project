import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Donation } from '../../interfaces/donation';
import { Donor } from '../../services/donor';

@Component({
  selector: 'app-my-donations',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-donations.html',
  styleUrl: './my-donations.css',
})
export class MyDonations {
  private readonly donor = inject(Donor);

  donations: Donation[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.getMyDonations();
  }

  getMyDonations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.donor.getMyDonations().subscribe({
      next: (res: any) => {
        this.donations = Array.isArray(res) ? res : (res.data ?? []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load donations';
        this.isLoading = false;
      }
    });
  }

  cancelDonation(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.donor.cancelDonation(id).subscribe({
      next: () => {
        this.successMessage = 'Donation cancelled successfully';
        this.getMyDonations();
      },
      error: (err) => {
        console.error(err);

        this.errorMessage =
          err?.error?.message ||
          'Failed to cancel donation';
      }
    });
  }
}