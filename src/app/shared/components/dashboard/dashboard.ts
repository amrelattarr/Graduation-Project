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
  imports: [RouterLink, CommonModule, RouterModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  private readonly httpClient = inject(HttpClient);

  dashboardData: DashboardAnalytics | null = null;

  public donationsChartData: any;
  public foodWeightChartData: any;

  public isAnalyticsLoading = true;
  public analyticsError: string | null = null;

  ngOnInit(): void {
    // ❌ API DISABLED FOR NOW
    this.displayDashboardData();

    // ✅ USE DUMMY DATA INSTEAD
    // this.loadDummyCharts();
  }

  // =========================
  // ❌ API CALL (COMMENTED OUT)
  // =========================
  
  displayDashboardData(): void {
    this.isAnalyticsLoading = true;
    this.analyticsError = null;
  
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
  
        this.dashboardData = {
          foodWeightPerMonth: response.foodWeightPerMonth,
          donationsPerMonth: response.donationsPerMonth,
          pendingRequests: response.pendingRequests,
          totalDonations: response.totalDonations,
          totalFoodWeight: response.totalFoodWeight,
          totalVolunteers: response.totalVolunteers
        };
  
        // ✅ SAFETY CHECK (important)
        const donations = response?.donationsPerMonth ?? [];
        const foodWeight = response?.foodWeightPerMonth ?? [];
  
        this.donationsChartData = this.mapToChartData(
          donations,
          'Donations per Month'
        );
  
        this.foodWeightChartData = this.mapToChartData(
          foodWeight,
          'Food Weight per Month'
        );
  
        console.log('Dashboard data:', this.dashboardData);
  
        this.isAnalyticsLoading = false;
      },
  
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.analyticsError = 'Failed to load dashboard analytics';
        this.isAnalyticsLoading = false;
      }
    });
  }
  

  // =========================
  // 📊 DUMMY DATA
  // =========================
  // loadDummyCharts(): void {

  //   this.dashboardData = {
  //     donationsPerMonth: [],
  //     foodWeightPerMonth: [],
  //     pendingRequests: 5,
  //     totalDonations: 2400,
  //     totalFoodWeight: 1800,
  //     totalVolunteers: 45
  //   };

  //   this.donationsChartData = this.mapToChartData([
  //     { label: 'January', value: 100 },
  //     { label: 'February', value: 140 },
  //     { label: 'March', value: 120 },
  //     { label: 'April', value: 180 },
  //     { label: 'May', value: 220 },
  //     { label: 'June', value: 260 },
  //     { label: 'July', value: 240 },
  //     { label: 'August', value: 300 },
  //     { label: 'September', value: 280 },
  //     { label: 'October', value: 320 },
  //     { label: 'November', value: 360 },
  //     { label: 'December', value: 400 }
  //   ], 'Donations per Month');

  //   this.foodWeightChartData = this.mapToChartData([
  //     { label: 'January', value: 80 },
  //     { label: 'February', value: 95 },
  //     { label: 'March', value: 110 },
  //     { label: 'April', value: 130 },
  //     { label: 'May', value: 150 },
  //     { label: 'June', value: 170 },
  //     { label: 'July', value: 160 },
  //     { label: 'August', value: 190 },
  //     { label: 'September', value: 210 },
  //     { label: 'October', value: 230 },
  //     { label: 'November', value: 250 },
  //     { label: 'December', value: 270 }
  //   ], 'Food Weight per Month');
  // }

  // =========================
  // 📈 CHART MAPPER
  // =========================
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