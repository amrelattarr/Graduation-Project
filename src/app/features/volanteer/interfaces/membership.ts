export interface Membership {
    id: number;
    charityId: number;
    charityName: string;
    status: 'Approved' | 'Suspended'; 
    rejectReason: string | null;
    suspendReason: string | null;
  }
