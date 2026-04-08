export interface Location {
    state: string;
    district: string;
    pincode: string;
}

export type StoreStatus = "Open" | "Likely open" | "Closed" | "Likely closed";

export interface KendraStore {
    name: string;
    kendraCode: string;
    address: string;
    state: string;
    district: string;
    pincode: number;
    status: StoreStatus;
}

export interface Hospital {
    id: number;
    hospitalCode: string;
    name: string;
    state: string;
    district: string;
    contactNumber: string | null;
    hospitalType: string | null;
    specialityNames: string[];
    schemeNames: string[];
    hasConvergence: boolean;
}

export type HospitalTypeOption =
    | "GOVT"
    | "PUBLIC"
    | "PRIVATE"
    | "NON_PROFIT_PRIVATE";

export interface DropdownResponse {
    code: string;
    name: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
}

export interface HospitalFilters {
    state: string;
    district: string;
    hospitalType: HospitalTypeOption | null;
    specialityIds: number[];
    schemeCodes: string[];
}
