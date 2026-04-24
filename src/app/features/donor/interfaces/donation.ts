export interface Donation {
  pictureUrl?: string;
  donationId: number;
  donorId?: string;
  donorName?: string;
  charityId?: number;
  charityName?: string;
  foodType: string;
  quantity: number;
  preparedTime: string;
  expirationTime: string;
  latitude: number;
  longitude: number;
  notes?: string;
  urgencyScore?: number;
  status: string;
  createdAt?: string;
  acceptedAt?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface CreateDonationRequest {
  foodType: string;
  quantity: number;
  preparedTime: string;
  expirationTime: string;
  latitude: number;
  longitude: number;
  notes: string;
  image?: File | null;
}

export interface EditDonationRequest {
  foodType: string;
  quantity: number;
  preparedTime: string;
  expirationTime: string;
  latitude: number;
  longitude: number;
  notes: string;
}

export interface DonationStatus {
  donationId: number;
  status: string;
  acceptedAt?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  expirationTime?: string;
}