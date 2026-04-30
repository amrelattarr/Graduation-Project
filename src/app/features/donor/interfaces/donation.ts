export interface Donation {
  pictureUrl: string;
  donationId: number;
  donorId: string;
  donorName: string | null;
  charityId: number;
  charityName: string;
  foodType: string;
  unitType: string;
  quantity: number;
  preparedTime: string;       // ISO date string
  expirationTime: string;     // ISO date string
  shelfLifeRemainingHours: number;
  latitude: number;
  longitude: number;
  notes: string | null;
  urgencyScore: number;
  status: string;
  createdAt: string;          // ISO date string
  acceptedAt: string | null;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
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
    charityId: number;
    foodType: string;
    unitType: string;
    quantity: number;
    preparedTime: string;
    latitude: number;
    longitude: number;
    notes?: string;
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