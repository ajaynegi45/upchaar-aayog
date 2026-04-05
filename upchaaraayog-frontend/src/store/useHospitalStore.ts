import { create } from "zustand";
import { Hospital, Location } from "./types";

interface HospitalState {
  hospitalResults: Hospital[];
  isLoading: boolean;
  error: string | null;
  filters: {
    nearest: boolean;
    allHospitals: boolean;
  };

  // Actions
  setHospitalResults: (results: Hospital[]) => void;
  toggleFilter: (filter: keyof HospitalState["filters"]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchHospitalResults: (location: Location) => Promise<void>;
}

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

export const useHospitalStore = create<HospitalState>((set) => ({
  hospitalResults: INITIAL_HOSPITALS,
  isLoading: false,
  error: null,
  filters: {
    nearest: true,
    allHospitals: true,
  },

  setHospitalResults: (hospitalResults) => set({ hospitalResults }),

  toggleFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: !state.filters[filter] }
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchHospitalResults: async (location: Location) => {
    // In a real app, this would fetch from an API
    console.log("Fetching hospitals for location:", location);
    // For now, we just keep the initial mock data
  },
}));
