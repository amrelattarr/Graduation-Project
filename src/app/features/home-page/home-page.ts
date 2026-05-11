import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // <--- Required for | number pipe
import { register } from 'swiper/element/bundle';

register();

interface ImpactStats {
  mealsDonated: number;
  volunteersCount: number;
  charitiesPartnered: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // <--- Added CommonModule
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  stats = signal<ImpactStats | null>(null);

  ngOnInit() {
    this.fetchImpactStatistics();
  }

  fetchImpactStatistics() {
    // TIP: Ensure your environment/proxy is set up for this relative URL
    this.http.get<ImpactStats>('/api/Home/impact-statistics').subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Failed to load impact statistics', err)
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}