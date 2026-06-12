import { VolunteerCharity } from './../../interfaces/volunteer-charity';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  VoluneerService,
  VolunteerAvailabilityStatus,
} from '../../services/voluneer-service';
import { Router, RouterLink } from '@angular/router';
import { Membership } from '../../interfaces/membership';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
  selector: 'app-volunteer-home',
  imports: [CommonModule , RouterLink],
  templateUrl: './volunteer-home.html',
  styleUrl: './volunteer-home.css',
})
export class VolunteerHome implements OnInit {
  private readonly voluneerService = inject(VoluneerService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  chartiesList : VolunteerCharity[] = []
  myMemberships : Membership[] = []
  readonly availability = VolunteerAvailabilityStatus;
  availabilityStatus = VolunteerAvailabilityStatus.Offline;
  isUpdatingStatus = false;
  statusErrorMessage = '';
  connectionErrorMessage = '';

  ngOnInit(): void {
    this.voluneerService.availability$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.availabilityStatus = status;
      });

    this.loadAvailabilityStatus();
    this.getAllCharties();
    this.displayMyMemberships();
    this.notificationService.realtimeUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getAllCharties();
        this.displayMyMemberships();
      });
  }

  setAvailabilityStatus(status: VolunteerAvailabilityStatus): void {
    if (
      this.isUpdatingStatus ||
      this.availabilityStatus === VolunteerAvailabilityStatus.Busy ||
      status === VolunteerAvailabilityStatus.Busy ||
      this.availabilityStatus === status
    ) {
      return;
    }

    this.isUpdatingStatus = true;
    this.statusErrorMessage = '';

    this.voluneerService.updateVolunteerStatus(status).subscribe({
      next: () => {
        this.availabilityStatus = status;
        this.isUpdatingStatus = false;
      },
      error: (err) => {
        console.error(err);
        this.statusErrorMessage = this.getApiErrorMessage(
          err,
          'Failed to update availability status'
        );
        this.isUpdatingStatus = false;
      },
    });
  }

  private loadAvailabilityStatus(): void {
    this.voluneerService.loadVolunteerStatus().subscribe({
      error: (err) => {
        console.error(err);
        this.statusErrorMessage = this.getApiErrorMessage(
          err,
          'Failed to load availability status'
        );
      },
    });
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    const validationErrors = error?.error?.Errors ?? error?.error?.errors;

    if (validationErrors && typeof validationErrors === 'object') {
      const messages = Object.values(validationErrors).flatMap((value) =>
        Array.isArray(value) ? value : [value]
      );

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    return error?.error?.detail || error?.error?.message || fallback;
  }

  getAllCharties(): void{
    this.voluneerService.getCharties().subscribe({
      next: (res) => {
        this.connectionErrorMessage = '';
        this.chartiesList = Array.isArray(res) ? res : (res.data ?? []);
      },
      error: (err) => {
        this.handleLoadError(err);
      }
    })
  }


  applyVolunteerByCharityId(x: number): void{
    this.voluneerService.applybyCharityId(x).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  displayMyMemberships(): void{
    this.voluneerService.getMyMemberships().subscribe({
      next: (res) => {
        this.connectionErrorMessage = '';
        const membership = res?.data ?? res;
        this.myMemberships = membership
          ? (Array.isArray(membership) ? membership : [membership])
          : [];
      },
      error: (err) => {
        this.handleLoadError(err);
      }
    })
  }

  private handleLoadError(error: any): void {
    if (error?.status === 0) {
      this.connectionErrorMessage =
        'The server is temporarily unavailable. Please try again shortly.';
      return;
    }

    console.error(error);
  }

}
