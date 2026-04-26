import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CharityService } from '../../services/charity';

@Component({
  selector: 'app-pickup-tasks',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pickup-tasks.html',
  styleUrl: './pickup-tasks.css',
})
export class PickupTasks {
  private readonly charityService = inject(CharityService);

  donations: any[] = [];
  openTasks: any[] = [];

  selectedDonationId: number | null = null;
  slaDueAt = '';

  isLoading = false;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadAcceptedUnassignedDonations();
    this.loadOpenTasks();
  }

  loadAcceptedUnassignedDonations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.charityService.getAcceptedUnassignedDonations().subscribe({
      next: (res: any) => {
        this.donations = Array.isArray(res) ? res : (res.data ?? []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to load available donations';
        this.isLoading = false;
      }
    });
  }

  loadOpenTasks(): void {
    this.charityService.getOpenPickupTasks().subscribe({
      next: (res: any) => {
        this.openTasks = Array.isArray(res) ? res : (res.data ?? []);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  openCreateBox(donationId: number): void {
    this.selectedDonationId = donationId;
    this.slaDueAt = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelCreate(): void {
    this.selectedDonationId = null;
    this.slaDueAt = '';
  }

  createPickupTask(): void {
    if (!this.selectedDonationId) return;

    if (!this.slaDueAt) {
      this.errorMessage = 'SLA due date is required';
      return;
    }

    const selectedDate = new Date(this.slaDueAt);
    const now = new Date();

    if (selectedDate <= now) {
      this.errorMessage = 'SLA due date must be in the future';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.charityService
      .createPickupTask(this.selectedDonationId, selectedDate.toISOString())
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Pickup task created successfully and volunteers were notified';
          this.selectedDonationId = null;
          this.slaDueAt = '';
          this.loadAcceptedUnassignedDonations();
          this.loadOpenTasks();
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to create pickup task';
        }
      });
  }
}