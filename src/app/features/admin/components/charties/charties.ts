import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminService } from '../../services/admin';
import { Charity } from '../../interfaces/charity';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
  selector: 'app-charties',
  imports: [CommonModule],
  templateUrl: './charties.html',
  styleUrl: './charties.css',
})
export class Charities implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  charitiesList: Charity[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadData();
    this.notificationService.realtimeUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadData());
  }

  loadData(): void {
    this.isLoading = true;
  
    this.admin.getCharities().subscribe({
      next: (res) => {
        console.log('Charities loaded:', res.data);
  
        this.charitiesList = (res.data ?? []).sort(
          (a, b) => a.charityId - b.charityId
        );
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Load charities error:', err);
        this.isLoading = false;
      },
    });
  }

  verifyCharityById(id: number): void {
    this.admin.verifyCharity(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }

  deActivateCharityById(id: number): void {
    this.admin.deactivateCharity(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }

  reActivateCharityById(id: number): void {
    this.admin.reactivateCharity(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err),
    });
  }

  toggleCharityStatus(charity: Charity): void {
    if (charity.isActivated) {
      this.deActivateCharityById(charity.charityId);
    } else {
      this.reActivateCharityById(charity.charityId);
    }
  }
}
