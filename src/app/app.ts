import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'grad-project';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.startConnection();
    this.notificationService.loadMyNotifications();
  }
}




// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { Register } from "./core/auth/register/register";
// import { Navbar } from "./shared/components/navbar/navbar";
// import { NotificationService } from './core/services/notification.service';
// import { inject } from '@angular/core/primitives/di';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, Navbar],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App implements OnInit {

//   private readonly notificationService = inject(NotificationService);

//   protected title = 'grad-project';

//   ngOnInit(): void {

//     this.notificationService.startConnection();

//     this.notificationService.loadMyNotifications();

//   }

// }
// export class App {
//   protected title = 'grad-project';
// }
