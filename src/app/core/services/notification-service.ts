import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  private hubConnection?: signalR.HubConnection;
  private pollingInterval?: ReturnType<typeof setInterval>;
  private consecutiveNetworkFailures = 0;
  private nextPollingAttemptAt = 0;

  private readonly notificationsSource = new BehaviorSubject<any[]>([]);
  readonly notifications$ = this.notificationsSource.asObservable();

  private readonly unreadCountSource = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSource.asObservable();

  private readonly realtimeUpdateSource = new Subject<any>();
  readonly realtimeUpdates$ = this.realtimeUpdateSource.asObservable();

  startConnection(): void {
    if (!localStorage.getItem('accessToken')) {
      return;
    }

    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.notificationHubUrl, {
        accessTokenFactory: () =>
          localStorage.getItem('accessToken') ?? '',
        withCredentials: false,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.on('ReceiveNotification', (notification) => {
      this.notificationsSource.next([
        notification,
        ...this.notificationsSource.value,
      ]);
      this.unreadCountSource.next(this.unreadCountSource.value + 1);
      this.realtimeUpdateSource.next(notification);
    });

    this.hubConnection.onreconnected(() => {
      this.stopPolling();
      this.loadMyNotifications();
      this.realtimeUpdateSource.next({ type: 'reconnected' });
    });

    this.hubConnection.onclose(() => {
      this.hubConnection = undefined;
      if (localStorage.getItem('accessToken')) {
        this.startPolling();
      }
    });

    this.hubConnection
      .start()
      .then(() => {
        this.stopPolling();
        this.loadMyNotifications();
      })
      .catch((error) => {
        console.error('Notification hub connection failed:', error);
        this.hubConnection = undefined;
        this.startPolling();
      });
  }

  loadMyNotifications(): void {
    if (!localStorage.getItem('accessToken')) {
      return;
    }

    this.httpClient
      .get<any>(`${environment.baseUrl}Notifications/My`)
      .subscribe({
        next: (res) => {
          this.consecutiveNetworkFailures = 0;
          this.nextPollingAttemptAt = 0;
          const list = Array.isArray(res) ? res : (res.data ?? []);
          this.notificationsSource.next(list);
          this.unreadCountSource.next(
            list.filter((notification: any) => !notification.isRead).length
          );
        },
        error: (error) => {
          if (error?.status === 0) {
            this.consecutiveNetworkFailures += 1;
            const delay = Math.min(
              60000,
              5000 * 2 ** (this.consecutiveNetworkFailures - 1)
            );
            this.nextPollingAttemptAt = Date.now() + delay;
            return;
          }

          console.error('Failed to load notifications:', error);
        },
      });
  }

  startPolling(): void {
    if (this.pollingInterval) {
      return;
    }

    this.loadMyNotifications();
    this.pollingInterval = setInterval(() => {
      if (
        localStorage.getItem('accessToken') &&
        Date.now() >= this.nextPollingAttemptAt
      ) {
        this.loadMyNotifications();
        this.realtimeUpdateSource.next({ type: 'poll' });
      }
    }, 15000);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }

  markAsRead(notificationId: number) {
    return this.httpClient.post(
      `${environment.baseUrl}Notifications/Read/${notificationId}`,
      {}
    );
  }

  updateOneAsRead(notificationId: number): void {
    const updated = this.notificationsSource.value.map((notification: any) =>
      notification.notificationId === notificationId ||
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );

    this.notificationsSource.next(updated);
    this.unreadCountSource.next(
      updated.filter((notification: any) => !notification.isRead).length
    );
  }

  stopConnection(): void {
    this.stopPolling();
    const connection = this.hubConnection;
    this.hubConnection = undefined;
    connection?.stop().catch((error) => {
      console.error('Error stopping notification hub:', error);
    });
  }

  getConnectionState(): signalR.HubConnectionState | 'NO_CONNECTION' {
    return this.hubConnection?.state ?? 'NO_CONNECTION';
  }
}
