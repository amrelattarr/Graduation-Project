import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Donation, DonationStatus, EditDonationRequest } from '../interfaces/donation';

@Injectable({
  providedIn: 'root',
})
export class Donor {
  private readonly httpClient = inject(HttpClient);

  createDonation(charityId: number, data: any, image?: File | null): Observable<any> {
    const formData = new FormData();
  
    // image (body)
    if (image) {
      formData.append('Image', image);
    }
  
    // query params
    const params = {
      FoodType: data.foodType,
      UnitType: data.unitType, // Kilos | Meals
      Quantity: data.quantity,
      PreparedTime: data.preparedTime,
      Latitude: data.latitude,
      Longitude: data.longitude,
      Notes: data.notes ?? ''
    };
  
    return this.httpClient.post(
      `${environment.baseUrl}Donation/Create/${charityId}`,
      formData,
      { params }
    );
  }

  editDonation(donationId: number, data: EditDonationRequest): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}Donation/Edit/${donationId}`,
      data
    );
  }

  cancelDonation(donationId: number): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}Donation/Cancel/${donationId}`,
      {}
    );
  }

  getMyDonations(): Observable<Donation[]> {
    return this.httpClient.get<Donation[]>(
      `${environment.baseUrl}Donation/MyDonations`
    );
  }

  getDonationDetails(donationId: number): Observable<Donation> {
    return this.httpClient.get<Donation>(
      `${environment.baseUrl}Donation/Details/${donationId}`
    );
  }

  getCharities(): Observable<any> {
  return this.httpClient.get(`${environment.baseUrl}Charity/List`);
}

  trackDonationStatus(donationId: number): Observable<DonationStatus> {
    return this.httpClient.get<DonationStatus>(
      `${environment.baseUrl}Donation/TrackStatus/${donationId}`
    );
  }
}