export interface Location {
  state: string;
  district: string;
  pincode: string;
}

export type StoreStatus = "Open" | "Likely open" | "Closed" | "Likely closed";

export interface KendraStore {
  name: string;
  address: string;
  state: string;
  district: string;
  pincode: number;
  status: StoreStatus;
}

export interface Hospital {
  name: string;
  distance: string;
  description: string;
  specialties: string[];
  isAyushmanEligible: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
}
