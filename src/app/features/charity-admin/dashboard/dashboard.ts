// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef,
//   inject,
//   signal,
//   computed,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { forkJoin, Subject } from 'rxjs';
// import { takeUntil, map } from 'rxjs/operators';
// import Chart from 'chart.js/auto';

// import { CharityService } from '../../../core/services/charity.service';
// import {
//   Donation,
//   Request,
//   Volunteer,
// } from '../../../core/models/charity.model';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css'],
// })
// export class Dashboard implements OnInit, OnDestroy {
//   private charityService = inject(CharityService);
//   private destroy$ = new Subject<void>();
//   private chartInstance: Chart | null = null;

//   @ViewChild('chartCanvas')
//   chartCanvas!: ElementRef<HTMLCanvasElement>;

//   // ================= SIGNALS =================
//   loading = signal(true);
//   error = signal<string | null>(null);

//   donations = signal<Donation[]>([]);
//   requests = signal<Request[]>([]);
//   volunteers = signal<Volunteer[]>([]);

//   // ================= COMPUTED =================
//   totalDonations = computed(() =>
//     this.donations().reduce((sum, d) => sum + (d.amount || 0), 0)
//   );

//   totalRequests = computed(() => this.requests().length);
//   totalVolunteers = computed(() => this.volunteers().length);

//   recentRequests = computed(() => this.requests().slice(0, 5));

//   // ================= INIT =================
//   ngOnInit() {
//     this.loadData();
//   }

//   // ================= DESTROY =================
//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();

//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }
//   }

//   // ================= LOAD DATA =================
//   loadData() {
//     this.loading.set(true);
//     this.error.set(null);

//     forkJoin({
//       donations: this.charityService.getDonations().pipe(
//         map((res) => res.data),
//         takeUntil(this.destroy$)
//       ),
//       requests: this.charityService.getRequests().pipe(
//         map((res) => res.data),
//         takeUntil(this.destroy$)
//       ),
//       volunteers: this.charityService.getVolunteers().pipe(
//         map((res) => res.data),
//         takeUntil(this.destroy$)
//       ),
//     }).subscribe({
//       next: (res) => {
//         this.donations.set(res.donations || []);
//         this.requests.set(res.requests || []);
//         this.volunteers.set(res.volunteers || []);

//         this.initChart();
//         this.loading.set(false);
//       },
//       error: (err) => {
//         console.error('Dashboard load error:', err);
//         this.error.set('Failed to load dashboard data. Please retry.');
//         this.loading.set(false);
//       },
//     });
//   }

//   // ================= CHART =================
//   private initChart() {
//     if (!this.chartCanvas) return;

//     const ctx = this.chartCanvas.nativeElement.getContext('2d');
//     if (!ctx) return;

//     // destroy old chart if exists (important 🔥)
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }

//     this.chartInstance = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: ['Requests', 'Volunteers'],
//         datasets: [
//           {
//             label: 'Count',
//             data: [this.totalRequests(), this.totalVolunteers()],
//             backgroundColor: [
//               'rgba(75, 192, 192, 0.6)',
//               'rgba(255, 159, 64, 0.6)',
//             ],
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   }
// }