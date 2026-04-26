export interface MonthlyStat {
  label: string;
  value: number;
}



export interface DashboardAnalytics {
  donationsPerMonth: MonthlyStat[];
  foodWeightPerMonth: MonthlyStat[];
  pendingRequests: number;
  totalDonations: number;
  totalFoodWeight: number;
  totalVolunteers: number;
  }