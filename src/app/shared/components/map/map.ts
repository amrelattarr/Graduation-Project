import { Component, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements AfterViewInit, OnDestroy {

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  map!: L.Map;
  marker!: L.Marker;

  selectedLat?: number;
  selectedLng?: number;

  private mapClickHandler: any;

  customIcon = L.divIcon({
    html: `<i class="fa-solid fa-location-dot" style="color:red; font-size: 28px;"></i>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  ngAfterViewInit(): void {

    const defaultLat = 30.0444;
    const defaultLng = 31.2357;

    this.map = L.map('map').setView([defaultLat, defaultLng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 0);

    // user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.map.setView([lat, lng], 14);
        this.setMarker(lat, lng);
      });
    }

    // click map
    this.mapClickHandler = (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    };

    this.map.on('click', this.mapClickHandler);
  }

  // 🔥 set marker
  setMarker(lat: number, lng: number) {

    this.selectedLat = lat;
    this.selectedLng = lng;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng], {
      icon: this.customIcon
    }).addTo(this.map);
  }

  // 🔥 confirm → send to parent
  confirmLocation() {
    if (!this.selectedLat || !this.selectedLng) return;

    this.locationSelected.emit({
      lat: this.selectedLat,
      lng: this.selectedLng
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }
}