export interface VolunteerCharity {
    charityId: number;
    organizationName: string;
    city: string | null;
    governorate: string | null;
    isVerified: boolean;
    isActivated: boolean;
}
