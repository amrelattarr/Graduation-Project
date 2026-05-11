export interface MyProfileInterface {
    user: {
      userId: string;
      email: string;
      fullName: string;
      phoneNumber: string;
    };
  
    role: string;
  
    donor: {
      isBusiness: boolean;
      businessType: string;
      isVerified: boolean;
      reliabilityScore: number;
      location: {
        latitude: number;
        longitude: number;
      };
      address: string;
    } | null;
  
    volunteer: {
      status: string;
      vehicleType: string;
      lastActiveAt: string;
      location: {
        latitude: number;
        longitude: number;
      };
      address: string;
      isVerified: boolean;
    } | null;
  
    charityAdmin: {
      charityId: number;
    } | null;
  }