import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  private hubConnection?: signalR.HubConnection;
  private pollingInterval?: any;

  private notificationsSource = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  private unreadCountSource = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSource.asObservable();

  startConnection(): void {
    console.log('START SIGNALR FUNCTION CALLED');

    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn('No accessToken found. SignalR will not start.');
      return;
    }

    if (this.hubConnection) {
      console.warn('SignalR already exists. State:', this.hubConnection.state);
      return;
    }

    const hubUrl = 'http://netfoodia.runasp.net/hubs/notifications';

    console.log('SignalR Hub URL:', hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        withCredentials: true
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveNotification', (notification) => {
      console.log('🔥 ReceiveNotification fired:', notification);

      const current = this.notificationsSource.value;
      this.notificationsSource.next([notification, ...current]);

      this.unreadCountSource.next(this.unreadCountSource.value + 1);
    });

    this.hubConnection.onreconnecting((error) => {
      console.warn('SignalR reconnecting...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
      this.loadMyNotifications();
    });

    this.hubConnection.onclose((error) => {
      console.error('SignalR closed:', error);
      this.hubConnection = undefined;
    });

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ Connected to SignalR');
        console.log('SignalR state:', this.hubConnection?.state);
      })
      .catch((err) => {
        console.error('❌ Notification Hub Error:', err);
        this.hubConnection = undefined;
      });
  }

  loadMyNotifications(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn('No accessToken found. Skip loading notifications.');
      return;
    }

    this.httpClient.get<any>(`${environment.baseUrl}Notifications/My`)
      .subscribe({
        next: (res) => {
          const list = Array.isArray(res) ? res : (res.data ?? []);

          this.notificationsSource.next(list);

          const unread = list.filter((n: any) => !n.isRead).length;
          this.unreadCountSource.next(unread);

          console.log('Notifications loaded:', list);
          console.log('Unread count:', unread);
        },
        error: (err) => {
          console.error('Failed to load notifications:', err);
        }
      });
  }

  startPolling(): void {
    if (this.pollingInterval) return;

    this.loadMyNotifications();

    this.pollingInterval = setInterval(() => {
      const role = localStorage.getItem('Role');
      const token = localStorage.getItem('accessToken');

      if (token && role === 'Volunteer') {
        this.loadMyNotifications();
      }
    }, 5000);
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
    const updated = this.notificationsSource.value.map((n: any) =>
      n.notificationId === notificationId || n.id === notificationId
        ? { ...n, isRead: true }
        : n
    );

    this.notificationsSource.next(updated);

    const unread = updated.filter((n: any) => !n.isRead).length;
    this.unreadCountSource.next(unread);
  }

  stopConnection(): void {
    this.stopPolling();

    this.hubConnection?.stop()
      .then(() => console.log('SignalR stopped'))
      .catch((err) => console.error('Error stopping SignalR:', err));

    this.hubConnection = undefined;
  }

  getConnectionState(): void {
    console.log('SignalR state:', this.hubConnection?.state || 'NO CONNECTION');
  }
}