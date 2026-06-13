import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./core/auth/register/register";
import { Navbar } from "./shared/components/navbar/navbar";
import { NotificationService } from './core/services/notification-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly notificationService = inject(NotificationService);
  protected title = 'grad-project';

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.notificationService.startConnection();
    }
  }
}
