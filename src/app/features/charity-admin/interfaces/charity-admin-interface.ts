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