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
  private signalrFailureCount = 0;

  private readonly notificationsSource = new BehaviorSubject<any[]>([]);
  readonly notifications$ = this.notificationsSource.asObservable();

  private readonly unreadCountSource = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSource.asObservable();

  private readonly realtimeUpdateSource = new Subject<any>();
  readonly realtimeUpdates$ = this.realtimeUpdateSource.asObservable();

  // ----------------------------
  // CONNECTION
  // ----------------------------
  startConnection(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.notificationHubUrl, {
        accessTokenFactory: () => localStorage.getItem('accessToken') ?? '',
        withCredentials: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount < 5) return 2000;
          return 10000;
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ----------------------------
    // REAL-TIME EVENT
    // ----------------------------
    this.hubConnection.on('ReceiveNotification', (notification) => {
      const current = this.notificationsSource.value;

      const exists = current.some(
        (n) =>
          n.notificationId === notification.notificationId ||
          n.id === notification.id
      );

      if (!exists) {
        this.notificationsSource.next([notification, ...current]);

        this.unreadCountSource.next(
          this.unreadCountSource.value + 1
        );
      }

      this.realtimeUpdateSource.next(notification);
    });

    // ----------------------------
    // RECONNECT
    // ----------------------------
    this.hubConnection.onreconnected(() => {
      this.signalrFailureCount = 0;
      this.stopPolling();
      this.loadMyNotifications();

      this.realtimeUpdateSource.next({ type: 'reconnected' });
    });

    // ----------------------------
    // CLOSE (FALLBACK SAFE)
    // ----------------------------
    this.hubConnection.onclose(() => {
      this.hubConnection = undefined;

      // DO NOT instantly switch to polling
      setTimeout(() => {
        if (!this.hubConnection && localStorage.getItem('accessToken')) {
          if (this.signalrFailureCount > 3) {
            this.startPolling();
          }
        }
      }, 15000);
    });

    // ----------------------------
    // START
    // ----------------------------
    this.hubConnection
      .start()
      .then(() => {
        this.signalrFailureCount = 0;
        this.stopPolling();
        this.loadMyNotifications();
      })
      .catch((error) => {
        console.error('SignalR connection failed:', error);

        this.hubConnection = undefined;
        this.signalrFailureCount++;

        if (this.signalrFailureCount > 3) {
          this.startPolling();
        }
      });
  }

  // ----------------------------
  // LOAD NOTIFICATIONS
  // ----------------------------
  loadMyNotifications(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.httpClient
      .get<any>(`${environment.baseUrl}Notifications/My`)
      .subscribe({
        next: (res) => {
          this.consecutiveNetworkFailures = 0;
          this.nextPollingAttemptAt = 0;

          const list = Array.isArray(res) ? res : (res.data ?? []);

          this.notificationsSource.next(list);

          this.unreadCountSource.next(
            list.filter((n: any) => !n.isRead).length
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

  // ----------------------------
  // POLLING (LAST RESORT ONLY)
  // ----------------------------
  startPolling(): void {
    if (this.pollingInterval) return;

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

  // ----------------------------
  // MARK AS READ
  // ----------------------------
  markAsRead(notificationId: number) {
    return this.httpClient.post(
      `${environment.baseUrl}Notifications/Read/${notificationId}`,
      {}
    );
  }

  updateOneAsRead(notificationId: number): void {
    const updated = this.notificationsSource.value.map((n: any) =>
      n.notificationId === notificationId || n.id === notificationId
        ? { ...n, isRead: true }
        : n
    );

    this.notificationsSource.next(updated);

    this.unreadCountSource.next(
      updated.filter((n: any) => !n.isRead).length
    );
  }

  // ----------------------------
  // STOP CONNECTION
  // ----------------------------
  stopConnection(): void {
    this.stopPolling();

    const connection = this.hubConnection;
    this.hubConnection = undefined;

    connection?.stop().catch((error) => {
      console.error('Error stopping SignalR:', error);
    });
  }

  // ----------------------------
  // STATE
  // ----------------------------
  getConnectionState(): signalR.HubConnectionState | 'NO_CONNECTION' {
    return this.hubConnection?.state ?? 'NO_CONNECTION';
  }
}