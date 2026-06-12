import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // <--- Required for | number pipe
import { register } from 'swiper/element/bundle';
import { HomeService } from './service/home-service';

register();

interface ImpactStats {
  mealsDonated: number;
  volunteersCount: number;
  charitiesPartnered: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule , RouterLink], // <--- Added CommonModule
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly homeService = inject (HomeService)

  stats = signal<ImpactStats | null>(null);
  statistics: any;

isLoadingStats = false;
errorMessage = '';

  ngOnInit() {
    this.loadStatistics();
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  loadStatistics(): void {
    this.isLoadingStats = true;
    this.errorMessage = '';
  
    this.homeService.sliderStatstics().subscribe({
      next: (res: any) => {
        console.log('Statistics:', res);
        this.statistics = res;
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Failed to load statistics';
        this.isLoadingStats = false;
      }
    });
  }


}