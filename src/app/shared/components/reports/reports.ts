import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/services/dashboard-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DonationReport, FoodType, UnitType } from './interfaces/report-interface';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [DecimalPipe , DatePipe , ReactiveFormsModule, CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {

  filterForm!: FormGroup;
  reportsData: DonationReport | null = null;
  loading = false;
  hasSearched = false;
  nightMode = false;

  unitTypes = Object.values(UnitType);
  foodTypes = Object.values(FoodType);

  toggleNightMode(): void {
    this.nightMode = !this.nightMode;
  }

  private readonly dashboardService = inject(DashboardService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
    // this.reportData();
  }

  initForm() {
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      unitType: [''],
      foodType: ['']
    });
  }

  reportData(): void {
    this.loading = true;
    this.hasSearched = true;

    const filters = this.filterForm.value;

    this.dashboardService.getReportData(filters).subscribe({
      next: (res: DonationReport) => {
        this.reportsData = res;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching report data:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.reportData();
  }

  resetFilters() {
    this.filterForm.reset();
    this.reportData();
  }
}