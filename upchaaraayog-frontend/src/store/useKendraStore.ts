import { create } from "zustand";
import { KendraStore, Pagination, StoreStatus, Location } from "./types";

interface KendraState {
  kendraResults: KendraStore[];
  isLoading: boolean;
  error: string | null;
  filters: {
    nearest: boolean;
    openNow: boolean;
  };
  pagination: Pagination;

  // Actions
  setKendraResults: (results: KendraStore[], append?: boolean) => void;
  toggleFilter: (filter: keyof KendraState["filters"]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchKendraResults: (location: Location, page?: number) => Promise<void>;
}

export const useKendraStore = create<KendraState>((set, get) => ({
  kendraResults: [],
  isLoading: false,
  error: null,
  filters: {
    nearest: true,
    openNow: false,
  },
  pagination: {
    currentPage: 0,
    totalPages: 0,
    pageSize: 5,
    totalElements: 0,
  },

  setKendraResults: (results, append = false) => set((state) => ({
    kendraResults: append ? [...state.kendraResults, ...results] : results
  })),

  toggleFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: !state.filters[filter] }
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchKendraResults: async (location: Location, page = 0) => {
    const { pagination, setLoading, setError, setKendraResults } = get();
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

      interface ApiContent {
        kendraName: string;
        kendraCode: string,
        address: string;
        state: string;
        district: string;
        pincode: number;
      }

      const mappedResults: KendraStore[] = (data.content as ApiContent[]).map((kendra) => ({
        name: kendra.kendraName,
        kendraCode: kendra.kendraCode,
        address: kendra.address,
        state: kendra.state,
        district: kendra.district,
        pincode: kendra.pincode,
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
