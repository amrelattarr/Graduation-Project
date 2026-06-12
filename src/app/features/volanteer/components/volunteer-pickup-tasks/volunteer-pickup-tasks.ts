import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VoluneerService,
  VolunteerPickupHistory,
  VolunteerPickupOffer,
  VolunteerAvailabilityStatus,
} from '../../services/voluneer-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { timer } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-volunteer-pickup-tasks',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './volunteer-pickup-tasks.html',
  styleUrl: './volunteer-pickup-tasks.css',
})
export class VolunteerPickupTasks implements OnInit {
  private readonly volunteerService = inject(VoluneerService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  offers: VolunteerPickupOffer[] = [];
  history: VolunteerPickupHistory[] = [];

  isLoading = false;
  isHistoryLoading = false;

  errorMessage = '';
  successMessage = '';
  membershipStatus = '';
  isOnline = false;
  readonly availability = VolunteerAvailabilityStatus;
  availabilityStatus = VolunteerAvailabilityStatus.Offline;

  // Inspection modal state
  showInspectionModal = false;
  inspectionTaskId: number | null = null;
  inspectionApproved = 'true';   // string for <select> binding
  inspectionReason = '';

  ngOnInit(): void {
    this.volunteerService.availability$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.availabilityStatus = status;
        this.isOnline = status !== VolunteerAvailabilityStatus.Offline;
      });

    this.volunteerService.loadVolunteerStatus().subscribe({
      next: () => {
        this.loadMembership();
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = this.getApiErrorMessage(
          err,
          'Could not load volunteer availability'
        );
        this.loadMembership();
        this.refreshAll();
      },
    });

    timer(5000, 5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isOnline) {
          this.refreshAll(false);
        }
      });

    this.notificationService.realtimeUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadMembership();
        if (this.isOnline) {
          this.refreshAll(false);
        }
      });
  }

  loadMembership(): void {
    this.volunteerService.getMyMemberships().subscribe({
      next: (res: any) => {
        const membership = res?.data ?? res;
        const current = Array.isArray(membership)
          ? membership[0]
          : membership;

        this.membershipStatus = String(current?.status ?? '');
      },
      error: (err) => {
        console.error(err);
        this.membershipStatus = '';
      },
    });
  }

  loadOffers(showLoading = true): void {
    if (showLoading) {
      this.isLoading = true;
      this.errorMessage = '';
    }

    this.volunteerService.getPickupOffers().subscribe({
      next: (res: any) => {
        this.offers = this.extractList<VolunteerPickupOffer>(res);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.detail ||
          err?.error?.message ||
          err?.message ||
          'Failed to load pickup offers';
        this.isLoading = false;
      }
    });
  }

  loadHistory(showLoading = true): void {
    if (showLoading) {
      this.isHistoryLoading = true;
    }

    this.volunteerService.getPickupHistory().subscribe({
      next: (res: any) => {
        this.history = this.extractList<VolunteerPickupHistory>(res);
        this.isHistoryLoading = false;
        this.syncAvailabilityWithTasks();
      },
      error: (err) => {
        console.error(err);
        this.isHistoryLoading = false;
      }
    });
  }

  getStatus(task: any): string {
    return String(
      task?.status ||
      task?.taskStatus ||
      task?.response ||
      ''
    ).toLowerCase();
  }

  getDisplayStatus(task: any): string {
    return (
      task?.status ||
      task?.taskStatus ||
      task?.response ||
      'Unknown'
    );
  }

  canAcceptOrReject(task: any): boolean {
    const status = this.getStatus(task);

    return (
      status === 'pending' ||
      status === 'offered' ||
      status === 'open'
    );
  }

  canStart(task: any): boolean {
    const status = this.getStatus(task);

    return (
      status === 'assigned' ||
      status === 'accepted'
    );
  }

  canCancel(task: any): boolean {
    const status = this.getStatus(task);

    return (
      status === 'assigned' ||
      status === 'accepted'
    );
  }

  canComplete(task: any): boolean {
    const status = this.getStatus(task);

    return (
      status === 'inprogress' ||
      status === 'in-progress' ||
      status === 'started'
    );
  }

  getTaskImageUrl(task: VolunteerPickupOffer): string | null {
    const imageUrl =
      task.pictureUrl ||
      task.resolvedPictureUrl ||
      task.donationPictureUrl ||
      task.donationImageUrl ||
      task.imageUrl ||
      task.donation?.pictureUrl ||
      task.donation?.imageUrl;

    if (!imageUrl) {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
      return imageUrl;
    }

    const apiOrigin = new URL(environment.baseUrl).origin;
    const normalizedPath = imageUrl.replace(/\\/g, '/');

    return new URL(normalizedPath, `${apiOrigin}/`).toString();
  }

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.hidden = true;

    const fallback = image.nextElementSibling as HTMLElement | null;
    fallback?.classList.remove('hidden');
  }


  acceptTask(taskId: number): void {
    this.clearMessages();

    this.volunteerService.acceptPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task accepted successfully';
        this.setAutomaticAvailability(true);
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to accept pickup task';
      }
    });
  }

  rejectTask(taskId: number): void {
    this.clearMessages();

    this.volunteerService.rejectPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task rejected successfully';
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to reject pickup task';
      }
    });
  }

  cancelTask(taskId: number): void {
    this.clearMessages();

    this.volunteerService.cancelPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task cancelled successfully';
        this.setAutomaticAvailability(false);
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to cancel pickup task';
      }
    });
  }

  openStartInspection(taskId: number): void {
    this.inspectionTaskId = taskId;
    this.inspectionApproved = 'true';
    this.inspectionReason = '';
    this.clearMessages();
    this.showInspectionModal = true;
  }

  confirmInspection(): void {
    if (!this.inspectionReason.trim()) {
      this.errorMessage = 'Please enter a reason for the inspection.';
      return;
    }
    const approved = this.inspectionApproved === 'true';
    this.showInspectionModal = false;
    this.clearMessages();

    this.volunteerService.makeInspection(
      this.inspectionTaskId!,
      approved,
      this.inspectionReason.trim()
    ).subscribe({
      next: () => {
        if (approved) {
          // Inspection passed — fire start task automatically
          this.startTask(this.inspectionTaskId!);
        } else {
          this.successMessage = 'Inspection submitted. Task was not approved.';
          this.refreshAll();
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.detail || err?.error?.message || 'Failed to submit inspection';
      }
    });
  }

  cancelInspectionModal(): void {
    this.showInspectionModal = false;
    this.inspectionTaskId = null;
  }

  startTask(taskId: number): void {
    this.clearMessages();
    this.volunteerService.startPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task started successfully';
        this.setAutomaticAvailability(true);
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to start pickup task';
      }
    });
  }

  completeTask(taskId: number): void {
    this.clearMessages();

    this.volunteerService.completePickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task completed successfully';
        this.setAutomaticAvailability(false);
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to complete pickup task';
      }
    });
  }

  refreshAll(showLoading = true): void {
    this.loadOffers(showLoading);
    this.loadHistory(showLoading);
  }

  private extractList<T>(response: any): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    const list =
      response?.data ??
      response?.items ??
      response?.value ??
      response?.result;

    return Array.isArray(list) ? list : [];
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

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private syncAvailabilityWithTasks(): void {
    const hasActiveTask = this.history.some((task) => {
      const status = this.getStatus(task);

      return (
        status === 'assigned' ||
        status === 'accepted' ||
        status === 'inprogress' ||
        status === 'in-progress' ||
        status === 'started'
      );
    });

    this.setAutomaticAvailability(hasActiveTask);
  }

  private setAutomaticAvailability(hasActiveTask: boolean): void {
    const statusUpdate =
      this.volunteerService.setBusyForActiveTask(hasActiveTask);

    statusUpdate?.subscribe({
      error: (err) => {
        console.error(err);
        this.errorMessage = this.getApiErrorMessage(
          err,
          'Task updated, but availability status could not be synchronized'
        );
      },
    });
  }
}
