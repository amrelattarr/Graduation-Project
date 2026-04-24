import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard-service';
import { HttpClient } from '@angular/common/http';
import { DashboardAnalytics } from './interfaces/dashboard-analytics';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly httpClient = inject(HttpClient);

  dashboardData: DashboardAnalytics | null = null;

  ngOnInit(): void {
    this.displayDashboardData();
  }

  displayDashboardData():void{
    this.dashboardService.getDashboardData().subscribe(
      (response) => {
        this.dashboardData = {
          monthlyAnalysis: response.monthlyAnalysis,
          pendingRequests: response.pendingRequests,
          totalDonations: response.totalDonations,
          totalFoodWeight: response.totalFoodWeight,
          totalVolunteers: response.totalVolunteers
        };
        console.log('Dashboard data:', response);
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

}
