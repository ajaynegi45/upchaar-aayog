import { create } from "zustand";
import { getApiBaseUrl } from "@/utils/api";

interface LocationStoreState {
  states: string[];
  districtsByState: Record<string, string[]>;
  isLoadingStates: boolean;
  isLoadingDistricts: boolean;
  error: string | null;

  // Actions
  fetchStates: () => Promise<void>;
  fetchDistricts: (stateName: string) => Promise<void>;
  clearError: () => void;
}

export const useLocationStore = create<LocationStoreState>((set, get) => ({
  states: [],
  districtsByState: {},
  isLoadingStates: false,
  isLoadingDistricts: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchStates: async () => {
    // If states are already loaded, don't re-fetch
    if (get().states.length > 0) return;

    set({ isLoadingStates: true, error: null });
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/states`);
      if (!response.ok) throw new Error("Failed to fetch states");
      const data = await response.json();
      set({ states: data });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Something went wrong fetching states" });
    } finally {
      set({ isLoadingStates: false });
    }
  },

  fetchDistricts: async (stateName: string) => {
    if (!stateName) return;

    // Check cache
    if (get().districtsByState[stateName]) return;

    set({ isLoadingDistricts: true, error: null });
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/states/${stateName}/districts`);
      if (!response.ok) throw new Error("Failed to fetch districts");
      const data = await response.json();
      set((state) => ({
        districtsByState: {
          ...state.districtsByState,
          [stateName]: data,
        },
      }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Something went wrong fetching districts" });
    } finally {
      set({ isLoadingDistricts: false });
    }
  },
}));
