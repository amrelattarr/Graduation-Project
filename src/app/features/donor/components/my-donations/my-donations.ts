import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Donation } from '../../interfaces/donation';
import { Donor } from '../../services/donor';
import { NotificationService } from '../../../../core/services/notification-service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-my-donations',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-donations.html',
  styleUrl: './my-donations.css',
})
export class MyDonations {
  private readonly donor = inject(Donor);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly failedImageIds = new Set<number>();

  donations: Donation[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.getMyDonations();
    this.notificationService.realtimeUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getMyDonations());
  }

  getMyDonations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.donor.getMyDonations().subscribe({
      next: (res: any) => {
        const donations = Array.isArray(res) ? res : (res.data ?? []);
        this.donations = donations.filter(
          (donation: Donation | null | undefined) =>
            donation && Number.isFinite(Number(donation.donationId))
        );
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

  getDonationImageUrl(donation: Donation): string | null {
    if (this.failedImageIds.has(donation.donationId)) {
      return null;
    }

    const imageUrl = donation.pictureUrl;

    if (!imageUrl) {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
      return imageUrl;
    }

    const apiOrigin = new URL(environment.baseUrl).origin;
    return new URL(imageUrl.replace(/\\/g, '/'), `${apiOrigin}/`).toString();
  }

  handleImageError(donationId: number): void {
    this.failedImageIds.add(donationId);
  }

  getStatusLabel(status: string | number): string {
    const numericStatuses: Record<number, string> = {
      0: 'Pending',
      1: 'Accepted',
      2: 'Rejected',
      3: 'Cancelled',
      4: 'Expired',
      5: 'Assigned',
      6: 'In Progress',
      7: 'Picked Up',
      8: 'Arrived at Charity',
    };

    if (typeof status === 'number' || /^\d+$/.test(String(status))) {
      return numericStatuses[Number(status)] ?? `Status ${status}`;
    }

    return status || 'Unknown';
  }

  getNormalizedStatus(status: string | number): string {
    return this.getStatusLabel(status).toLowerCase();
  }
}
