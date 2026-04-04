export type PayoutStatus = 'COMPLETED' | 'PENDING' | 'REJECTED';

export interface PayoutRecord {
  id: string;
  date: string;
  trigger: string;
  location: string;
  payout: string;
  status: PayoutStatus;
  txId: string;
  coverageWeek: string;
}

export const HISTORY_DATA: PayoutRecord[] = [
  {
    id: '1',
    date: 'Aug 14, 2025',
    trigger: 'Rainfall > 50mm/hr',
    location: 'Koramangala, BLR',
    payout: '₹1,500',
    status: 'COMPLETED',
    txId: 'upi_ref_183940182',
    coverageWeek: 'Aug 10 – Aug 16',
  },
  {
    id: '2',
    date: 'Jul 02, 2025',
    trigger: 'Civic Curfew (Sec 144)',
    location: 'Indiranagar, BLR',
    payout: '₹3,000',
    status: 'COMPLETED',
    txId: 'upi_ref_002931823',
    coverageWeek: 'Jun 30 – Jul 06',
  },
  {
    id: '3',
    date: 'Jun 08, 2025',
    trigger: 'Heatwave > 45°C',
    location: 'HSR Layout, BLR',
    payout: '₹1,500',
    status: 'PENDING',
    txId: 'upi_ref_pending_338',
    coverageWeek: 'Jun 02 – Jun 08',
  },
];
