import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Donation, DonationStatus } from '../../interfaces/donation';
import { Donor } from '../../services/donor';
import { NotificationService } from '../../../../core/services/notification-service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-donation-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './donation-details.html',
  styleUrl: './donation-details.css',
})
export class DonationDetails {
  private readonly donor = inject(Donor);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  donation!: Donation;
  track: DonationStatus | null = null;
  donationId!: number;

  isLoading = false;
  errorMessage = '';
  imageLoadFailed = false;

  ngOnInit(): void {
    this.donationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetails();
    this.loadTracking();
    this.notificationService.realtimeUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadDetails();
        this.loadTracking();
      });
  }

  loadDetails(): void {
    this.isLoading = true;

    this.donor.getDonationDetails(this.donationId).subscribe({
      next: (res: any) => {
        this.donation = res.data ?? res;
        this.imageLoadFailed = false;
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

  get imageUrl(): string | null {
    if (this.imageLoadFailed) {
      return null;
    }

    const pictureUrl = this.donation?.pictureUrl;

    if (!pictureUrl) {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(pictureUrl)) {
      return pictureUrl;
    }

    const apiOrigin = new URL(environment.baseUrl).origin;
    return new URL(pictureUrl.replace(/\\/g, '/'), `${apiOrigin}/`).toString();
  }

  get deliveredAt(): string | null {
    return this.track?.deliveredAt || this.donation?.deliveredAt || null;
  }

  get hasArrived(): boolean {
    const status = this.track?.status ?? this.donation?.status;
    const normalizedStatus = String(status ?? '').trim().toLowerCase();

    return (
      !!this.deliveredAt ||
      normalizedStatus === '8' ||
      normalizedStatus === 'delivered' ||
      normalizedStatus === 'completed' ||
      normalizedStatus === 'arrived'
    );
  }

  get statusLabel(): string {
    const status = this.track?.status ?? this.donation?.status;

    if (String(status) === '8') {
      return 'Arrived at Charity';
    }

    return String(status || 'Unknown');
  }

  handleImageError(): void {
    this.imageLoadFailed = true;
  }
}
