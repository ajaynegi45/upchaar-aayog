import { create } from "zustand";

export interface Location {
  state: string;
  district: string;
  pincode: string;
}

export interface KendraStore {
  name: string;
  address: string;
  distance: string;
  status: "Open" | "Likely open" | "Closed";
}

export interface Hospital {
  name: string;
  distance: string;
  description: string;
  specialties: string[];
  isAyushmanEligible: boolean;
}

interface SearchState {
  // Location State
  location: Location;

  // Results State
  kendraResults: KendraStore[];
  hospitalResults: Hospital[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Filters (Page-specific logic can be handled here or via setters)
  filters: {
    nearest: boolean;
    openNow: boolean;
    allHospitals: boolean;
  };

  // Actions
  setLocation: (location: Location) => void;
  setKendraResults: (results: KendraStore[]) => void;
  setHospitalResults: (results: Hospital[]) => void;
  toggleFilter: (filter: keyof SearchState["filters"]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initial dummy data to maintain existing functionality
const INITIAL_STORES: KendraStore[] = [
  {
    name: "S.S Rajoria ",
    address: "Garage No. 29, Shastri Bhawan",
    distance: "0.8 km",
    status: "Open",
  },
  {
    name: "Pradhan Mantri Jan Aushadhi Kendra",
    address: "Jan AushadhiIndian Medical Association(IMA) House Indraprastha Marg",
    distance: "1.2 km",
    status: "Likely open",
  },
  {
    name: "Shusrut Pmb Jan Aushadhi Kendra",
    address: "G143/S-3 KH No 1076/5/2 Dilshad Ext1 Dilshad Colony Tel Seemapuri",
    distance: "2.1 km",
    status: "Closed",
  },
  {
    name: "Bharat Madical Store",
    address: "D-50, Ground Floor, KH No-219, Abul Fazal Enclave Part-1, Jamia Nagar, Okhla",
    distance: "2.1 km",
    status: "Closed",
  }
];

const INITIAL_HOSPITALS: Hospital[] = [
  {
    name: "City General Hospital",
    distance: "2.5 km away",
    description: "Provides comprehensive treatment under Ayushman Bharat scheme",
    specialties: ["General Surgery", "Medicine", "Emergency"],
    isAyushmanEligible: true,
  },
  {
    name: "Metro Medicare Hospital",
    distance: "4.1 km away",
    description: "Specialized care available under the PMJAY scheme",
    specialties: ["Cardiology", "Pediatrics", "Orthopedics"],
    isAyushmanEligible: true,
  },
  {
    name: "Sanjeevani Care Centre",
    distance: "5.8 km away",
    description: "Providing accessible healthcare to all eligible beneficiaries",
    specialties: ["Internal Medicine", "Gynaecology"],
    isAyushmanEligible: true,
  },
];

export const useSearchStore = create<SearchState>((set) => ({
  location: {
    state: "Haryana",
    district: "Gurugram",
    pincode: "122001",
  },
  kendraResults: INITIAL_STORES,
  hospitalResults: INITIAL_HOSPITALS,
  isLoading: false,
  error: null,
  filters: {
    nearest: true,
    openNow: false,
    allHospitals: true,
  },

  setLocation: (location) => set({ location }),
  setKendraResults: (kendraResults) => set({ kendraResults }),
  setHospitalResults: (hospitalResults) => set({ hospitalResults }),
  toggleFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: !state.filters[filter] }
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
