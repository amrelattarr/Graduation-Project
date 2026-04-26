import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {

  private locationSubject = new BehaviorSubject<{ lat: number, lng: number } | null>(null);

  location$ = this.locationSubject.asObservable();

  setLocation(lat: number, lng: number) {
    this.locationSubject.next({ lat, lng });
  }

}