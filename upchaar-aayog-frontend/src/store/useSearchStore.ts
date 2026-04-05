import { create } from "zustand";

export interface Location {
  state: string;
  district: string;
  pincode: string;
}

type StoreStatus = "Open" | "Likely open" | "Closed" | "Likely closed";
export interface KendraStore {
  name: string;
  address: string;
  state: string;
  district: string;
  pincode: number;
  // distance: string;
  status: StoreStatus;
}


//  https://hospitals.pmjay.gov.in/Search/empnlWorkFlow.htm
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
  setKendraResults: (results: KendraStore[], append?: boolean) => void;
  setHospitalResults: (results: Hospital[]) => void;
  toggleFilter: (filter: keyof SearchState["filters"]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Pagination actions
  fetchKendraResults: (page?: number) => Promise<void>;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
  };
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

export const useSearchStore = create<SearchState>((set, get) => ({
  location: {
    state: "Delhi",
    district: "West",
    pincode: "",
  },
  kendraResults: [], // Start empty to fetch from backend
  hospitalResults: INITIAL_HOSPITALS,
  isLoading: false,
  error: null,
  filters: {
    nearest: true,
    openNow: false,
    allHospitals: true,
  },
  pagination: {
    currentPage: 0,
    totalPages: 0,
    pageSize: 5,
    totalElements: 0,
  },

  setLocation: (location) => set({ location }),

  setKendraResults: (results, append = false) => set((state) => ({
    kendraResults: append ? [...state.kendraResults, ...results] : results
  })),

  setHospitalResults: (hospitalResults) => set({ hospitalResults }),

  toggleFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: !state.filters[filter] }
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchKendraResults: async (page = 0) => {
    const { location, pagination, setLoading, setError, setKendraResults } = get();
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        state: location.state,
        district: location.district,
        pageNumber: page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (location.pincode) {
        queryParams.append("pincode", location.pincode);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jan-aushadhi-kendra?${queryParams.toString()}`);


      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }

      const data = await response.json();

      console.log(data);

      interface ApiContent {
        kendraName: string;
        address: string;
        state: string;
        district: string;
        pincode: number;
      }

      const mappedResults: KendraStore[] = (data.content as ApiContent[]).map((kendra) => ({
        name: kendra.kendraName,
        address: kendra.address,
        state: kendra.state,
        district: kendra.district,
        pincode: kendra.pincode,

        // distance: `${(Math.random() * 5).toFixed(1)} km`,
        status: getStatus()
      }));

      setKendraResults(mappedResults, page > 0);
      set({
        pagination: {
          ...pagination,
          currentPage: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching stores");
    } finally {
      setLoading(false);
    }
  },
}));



function getStatus(): StoreStatus {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const hour = Number(parts.find(p => p.type === "hour")?.value);
  const weekday = parts.find(p => p.type === "weekday")?.value;

  const isWeekend = weekday === "Sun" || weekday === "Sat";

  if (hour >= 22 || hour < 9) return "Closed";
  if (hour >= 21) return "Likely closed";

  if (hour >= 10) {
    return isWeekend ? "Likely open" : "Open";
  }

  if (hour >= 9) return "Likely open";

  return "Closed";
}
