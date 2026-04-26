import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard-service';
import { HttpClient } from '@angular/common/http';
import { DashboardAnalytics, MonthlyStat } from './interfaces/dashboard-analytics';
import { RouterLink, RouterModule } from "@angular/router";
import 'chartjs-chart-financial';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [RouterLink , CommonModule , RouterModule , NgChartsModule],
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

  displayDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe(
      (response) => {
        this.dashboardData = {
          foodWeightPerMonth: response.foodWeightPerMonth,
          donationsPerMonth: response.donationsPerMonth,
          pendingRequests: response.pendingRequests,
          totalDonations: response.totalDonations,
          totalFoodWeight: response.totalFoodWeight,
          totalVolunteers: response.totalVolunteers
        };
  
        // 🔥 Convert to chart data
        this.donationsChartData = this.mapToChartData(
          response.donationsPerMonth,
          'Donations per Month'
        );
  
        this.foodWeightChartData = this.mapToChartData(
          response.foodWeightPerMonth,
          'Food Weight per Month'
        );
  
        console.log('Dashboard data:', this.dashboardData);
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  public donationsChartData: any;
public foodWeightChartData: any;

public isAnalyticsLoading = true;
public analyticsError: string | null = null;

private mapToChartData(data: MonthlyStat[], label: string) {
  return {
    labels: data.map(item => item.label),
    datasets: [
      {
        label,
        data: data.map(item => item.value),
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };
}

}
