export interface CreateCharityRequest {
    organizationName: string;
    licenseNumber: string;
    address: string;
    city: string;
    governorate: string;
    latitude: number;
    longitude: number;
  }
  
  export interface Charity {
    id: string;
    organizationName: string;
    licenseNumber: string;
    address: string;
    city: string;
    governorate: string;
    latitude: number;
    longitude: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    message?: string;
    success: boolean;
  }
  
  export interface ApiError {
    success: false;
    message: string;
    statusCode?: number;
  }
  
  // Dashboard interfaces
  export interface Donation {
    id: string;
    amount: number;
    donorName?: string;
    createdAt?: string;
  }
  
  export interface Request {
    id: string;
    name: string;
    foodType: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
  }
  
  export interface Volunteer {
    id: string;
    name: string;
    email?: string;
    joinedAt?: string;
  }
  
  // Update charity interfaces
  export interface UpdateCharityInfoRequest {
    organizationName: string;
    licenseNumber: string;
  }
  
  export interface UpdateCharityLocationRequest {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    governorate: string;

  }

  export interface MyVoulunteers {
    id: number;
    volunteerId: string;
    volunteerName: string;
    address: string;
    status: string;
  }

  export interface PendingCharityDonation {
  donationId: number;
  pictureUrl?: string;
  donorName: string;
  foodType: string;
  quantity: number;
  expirationTime: string;
  urgencyScore: number;
  createdAt: string;
}

export interface RejectDonationRequest {
  reason: string;
}

export interface AcceptedUnassignedDonation {
  donationId: number;
  pictureUrl?: string;
  donorName?: string;
  foodType: string;
  quantity: number;
  expirationTime: string;
  urgencyScore: number;
  createdAt: string;
}

export interface CreatePickupTaskRequest {
  slaDueAt: string;
}

export interface PickupTask {
  taskId: number;
  donationId: number;
  charityId: number;
  charityName: string;
  donationTitle: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  status: string;
  slaDueAt: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}