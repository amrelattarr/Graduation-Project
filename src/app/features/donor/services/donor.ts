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
if (image) {
  formData.append('Image', image);
}
    formData.append('FoodType', data.foodType);
    formData.append('Quantity', String(data.quantity));
    formData.append('PreparedTime', data.preparedTime);
    formData.append('ExpirationTime', data.expirationTime);
    formData.append('Latitude', String(data.latitude));
    formData.append('Longitude', String(data.longitude));
    formData.append('Notes', data.notes ?? '');

    return this.httpClient.post(
      `${environment.baseUrl}Donation/Create/${charityId}`,
      formData
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