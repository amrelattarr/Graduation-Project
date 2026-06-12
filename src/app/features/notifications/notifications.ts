import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification-service';


@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.loadMyNotifications();
  }

  markAsRead(notification: any): void {
    const id = notification.notificationId || notification.id;

    if (!id) return;

    this.notificationService.markAsRead(id).subscribe({
      next: () => this.notificationService.updateOneAsRead(id),
      error: (err) => console.error(err)
    });
  }
}