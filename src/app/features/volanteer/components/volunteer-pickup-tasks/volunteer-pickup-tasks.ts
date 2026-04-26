import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoluneerService } from '../../services/voluneer-service';

@Component({
  selector: 'app-volunteer-pickup-tasks',
  imports: [CommonModule, RouterLink],
  templateUrl: './volunteer-pickup-tasks.html',
  styleUrl: './volunteer-pickup-tasks.css',
})
export class VolunteerPickupTasks implements OnInit {
  private readonly volunteerService = inject(VoluneerService);

  offers: any[] = [];
  history: any[] = [];

  isLoading = false;
  isHistoryLoading = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.refreshAll();
  }

  loadOffers(): void {
    this.isLoading = true;
    this.clearMessages();

    this.volunteerService.getPickupOffers().subscribe({
      next: (res: any) => {
        this.offers = Array.isArray(res) ? res : (res.data ?? []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to load pickup offers';
        this.isLoading = false;
      }
    });
  }

  loadHistory(): void {
    this.isHistoryLoading = true;

    this.volunteerService.getPickupHistory().subscribe({
      next: (res: any) => {
        this.history = Array.isArray(res) ? res : (res.data ?? []);
        this.isHistoryLoading = false;
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
      status === 'in-progress'
    );
  }

  acceptTask(taskId: number): void {
    this.clearMessages();

    this.volunteerService.acceptPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task accepted successfully';
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
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to cancel pickup task';
      }
    });
  }

  startTask(taskId: number): void {
    this.clearMessages();
    this.volunteerService.startPickupTask(taskId).subscribe({
      next: () => {
        this.successMessage = 'Pickup task started successfully';
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
        this.refreshAll();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to complete pickup task';
      }
    });
  }

  refreshAll(): void {
    this.loadOffers();
    this.loadHistory();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}