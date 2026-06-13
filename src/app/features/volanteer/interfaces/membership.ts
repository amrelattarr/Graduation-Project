export interface Membership {
    id: number;
    charityId: number;
    charityName: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
    rejectReason: string | null;
    suspendReason: string | null;
  }
