import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { CharityService } from './../../../core/services/charity.service';
import { AuthService } from './../../../core/auth/services/auth-service';
import type { ApiResponse, Charity } from './../../../core/models/charity.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details implements OnInit, OnDestroy {

  private readonly charityService = inject(CharityService);
  private readonly authService = inject(AuthService);

  charity: Charity | null = null;
  loading = true;
  error = '';

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loadCharityDetails();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadCharityDetails(): void {

    const charityId = this.authService.getCharityId();

    // ❌ no id
    if (!charityId) {
      this.error = 'No charity ID found';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.subscriptions.add(
      this.charityService.getCharityDetails(charityId).subscribe({
        next: (res: ApiResponse<Charity>) => {

          // ✅ safe access
          this.charity = res?.data ?? null;

          this.loading = false;
        },

        error: (err: any) => {
          console.error('Load details error:', err);

          this.error = 'Failed to load charity details';
          this.loading = false;
        }
      })
    );
  }
}