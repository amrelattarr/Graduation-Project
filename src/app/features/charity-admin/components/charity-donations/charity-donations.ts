import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PendingCharityDonation } from '../../interfaces/charity-admin-interface';
import { CharityService } from '../../services/charity';

@Component({
  selector: 'app-charity-donations',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './charity-donations.html',
  styleUrl: './charity-donations.css',
})
export class CharityDonations {
  private readonly charityService = inject(CharityService);

  donations: PendingCharityDonation[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  selectedDonationId: number | null = null;
  rejectReason = '';

  ngOnInit(): void {
    this.getPendingDonations();
  }

  getPendingDonations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.charityService.getPendingDonations().subscribe({
      next: (res) => {
        this.donations = res.data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.message || 'Failed to load pending donations';
        this.isLoading = false;
      }
    });
  }

  acceptDonation(donationId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.charityService.acceptDonation(donationId).subscribe({
      next: () => {
        this.successMessage = 'Donation accepted successfully';
        this.getPendingDonations();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.message || 'Failed to accept donation';
      }
    });
  }

  openRejectBox(donationId: number): void {
    this.selectedDonationId = donationId;
    this.rejectReason = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelReject(): void {
    this.selectedDonationId = null;
    this.rejectReason = '';
  }

  rejectDonation(): void {
    if (!this.selectedDonationId) return;

    if (!this.rejectReason.trim()) {
      this.errorMessage = 'Reject reason is required';
      return;
    }

    this.charityService.rejectDonation(this.selectedDonationId, {
      reason: this.rejectReason.trim()
    }).subscribe({
      next: () => {
        this.successMessage = 'Donation rejected successfully';
        this.selectedDonationId = null;
        this.rejectReason = '';
        this.getPendingDonations();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.message || 'Failed to reject donation';
      }
    });
  }

  markExpired(donationId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.charityService.markDonationExpired(donationId).subscribe({
      next: () => {
        this.successMessage = 'Donation marked as expired';
        this.getPendingDonations();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.message || 'Failed to mark donation as expired';
      }
    });
  }
}