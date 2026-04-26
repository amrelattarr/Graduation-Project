import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyVoulunteers } from '../../interfaces/charity-admin-interface';
import { CharityService } from '../../services/charity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-volunteers',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-volunteers.html',
  styleUrl: './my-volunteers.css',
})
export class MyVolunteers implements OnInit {
  private readonly charityService = inject(CharityService);

  PendingList: MyVoulunteers[] = [];
  AcceptedList: MyVoulunteers[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getPendingVolunteers();
    this.getAcceptedVolunteers();
  }

  getPendingVolunteers(): void {
    this.isLoading = true;

    this.charityService.displayAllpendingRequests(7).subscribe({
      next: (res) => {
        this.PendingList = Array.isArray(res) ? res : (res.data ?? []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load pending volunteers';
        this.isLoading = false;
      }
    });
  }

  getAcceptedVolunteers(): void {
    this.charityService.displayAllApprovedVolunteers(7).subscribe({
      next: (res) => {
        this.AcceptedList = Array.isArray(res) ? res : (res.data ?? []);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load approved volunteers';
      }
    });
  }

  approveVolunteerById(id: number): void {
    this.clearMessages();

    this.charityService.approveVolunteerRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Volunteer approved successfully';
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to approve volunteer';
      }
    });
  }

  rejectVolunteerById(id: number): void {
    this.clearMessages();

    this.charityService.rejectVolunteerRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Volunteer rejected successfully';
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to reject volunteer';
      }
    });
  }

  suspendVolunteerById(id: number): void {
    this.clearMessages();

    this.charityService.suspendVolunter(id).subscribe({
      next: () => {
        this.successMessage = 'Volunteer suspended successfully';
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to suspend volunteer';
      }
    });
  }

  reActivateVolunteerById(id: number): void {
    this.clearMessages();

    this.charityService.ActivateVolunter(id).subscribe({
      next: () => {
        this.successMessage = 'Volunteer activated successfully';
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to activate volunteer';
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}