export type PlasticType = 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'PVC' | 'ABS' | 'Other';

export type PlasticGrade = 
  | 'Grade A - Clean / Post-Industrial' 
  | 'Grade B - Washed / Minor Contamination' 
  | 'Grade C - Mixed / Post-Consumer' 
  | 'Regrind / Flakes' 
  | 'Industrial Purge / Off-spec';

export type ListingStatus = 
  | 'Available' 
  | 'Request Received' 
  | 'Collection Scheduled' 
  | 'Collected';

export type EnquiryStatus = 
  | 'Enquiry Sent' 
  | 'Confirmed' 
  | 'Collection Scheduled' 
  | 'Collected';

export type UserRole = 'Industry' | 'Recycler';

export interface UserProfile {
  fullName: string;
  phone: string; // "+91 9876543210"
  organizationName: string;
  role: UserRole;
  city: string;
  state: string;
  registeredAt: string;
}

export interface WasteListing {
  id: string;
  sellerId: string;
  sellerOrg: string;
  sellerCity: string;
  sellerState: string;
  sellerPhone: string;
  plasticType: PlasticType;
  quantityKg: number;
  grade: string;
  condition: string; // e.g. "Baled, washed, labels removed", "Flakes, dry", etc.
  city: string;
  state: string;
  expectedPricePerKg: number | null; // optional selling price
  description?: string;
  imageUrl?: string;
  createdAt: string;
  status: ListingStatus;
  isDemoSample?: boolean;
}

export interface StatusHistoryEntry {
  status: EnquiryStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Enquiry {
  id: string;
  listingId: string;
  listingSnapshot: {
    plasticType: PlasticType;
    grade: string;
    condition: string;
    sellerOrg: string;
    city: string;
    state: string;
    expectedPricePerKg: number | null;
    totalAvailableKg: number;
  };
  recycler: {
    fullName: string;
    organizationName: string;
    phone: string;
    city: string;
    state: string;
  };
  requestedQuantityKg: number;
  message?: string;
  proposedPricePerKg?: number | null;
  agreedPricePerKg?: number | null;
  transportCost?: number | null;
  otherCharges?: number | null;
  scheduledCollectionDate?: string;
  requestDate: string;
  currentStatus: EnquiryStatus;
  history: StatusHistoryEntry[];
}

export interface BatchSuggestion {
  id: string;
  listings: WasteListing[];
  totalQuantityKg: number;
  matchScore: number;
  reason: string;
  averagePricePerKg: number | null;
  calculableSubtotal: number | null;
  isCombinedBatch: boolean;
}
