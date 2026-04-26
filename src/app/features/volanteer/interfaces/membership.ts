// export interface Membership {
//     id: number;
//     charityId: number;
//     charityName: string;
//     status: 'Approved' | 'Suspended'; 
//     rejectReason: string | null;
//     suspendReason: string | null;
//   }
export interface Membership {
  id: number;
  charityName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  rejectReason?: string;
  suspendReason?: string;
}