import {create} from "zustand";
import {Hospital, HospitalFilters, HospitalTypeOption, Pagination} from "./types";
import {hospitalService} from "@/services/hospitalService";

export const DEFAULT_HOSPITAL_STATE = "NCT OF Delhi";
export const DEFAULT_HOSPITAL_TYPE = "GOVT";

interface HospitalState {
    hospitalResults: Hospital[];
    isLoading: boolean;
    error: string | null;
    filters: {
        state: string;
        district: string;
        hospitalType: HospitalTypeOption | null;
    };
    pagination: Pagination;
    metadata: {
        states: string[];
        districts: string[];
        types: HospitalTypeOption[];
    };

    // Actions
    setFilter: (field: "state" | "district" | "hospitalType", value: string | null) => void;
    fetchStates: () => Promise<void>;
    fetchDistricts: (state: string) => Promise<void>;
    fetchHospitalTypes: (state: string, district?: string) => Promise<void>;
    searchHospitals: (page?: number) => Promise<void>;
    clearDefaultHospitalType: () => void;
}

const DEFAULT_PAGINATION: Pagination = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalElements: 0,
};

function mergeHospitalPages(existing: Hospital[], nextPage: Hospital[]): Hospital[] {
    if (nextPage.length === 0) return existing;
    const seenIds = new Set(existing.map((h) => h.id));
    const unseen = nextPage.filter((h) => !seenIds.has(h.id));
    return unseen.length === 0 ? existing : [...existing, ...unseen];
}

export const useHospitalStore = create<HospitalState>((set, get) => ({
    hospitalResults: [],
    isLoading: false,
    error: null,
    filters: {
        state: DEFAULT_HOSPITAL_STATE,
        district: "",
        hospitalType: DEFAULT_HOSPITAL_TYPE,
    },
    pagination: DEFAULT_PAGINATION,
    metadata: {
        states: [],
        districts: [],
        types: [],
    },

    setFilter: (field, value) => {
        const currentFilters = get().filters;
        if (currentFilters[field] === value) return;

        const newFilters = {...currentFilters, [field]: value};

        if (field === "state") {
            const nextState = value as string;
            set((state) => ({
                ...state,
                error: null,
                filters: {
                    ...newFilters,
                    district: "",
                    hospitalType: null, // Don't force GOVT on user-initiated changes
                },
                metadata: {
                    ...state.metadata,
                    districts: [],
                },
            }));

            if (nextState) {
                void get().fetchDistricts(nextState);
                void get().fetchHospitalTypes(nextState);
                // Also trigger an automatic search when state changes if you prefer,
                // but let's let the component handle that.
            }
            return;
        }

        if (field === "district") {
            const nextDistrict = value as string;
            set((state) => ({
                ...state,
                error: null,
                filters: {
                    ...newFilters,
                    // Keep the hospitalType as is when picking district
                },
            }));

            if (currentFilters.state) {
                void get().fetchHospitalTypes(currentFilters.state, nextDistrict);
            }
            return;
        }

        set((state) => ({
            ...state,
            error: null,
            filters: newFilters as any,
        }));
    },

    fetchStates: async () => {
        try {
            const states = await hospitalService.getStates();
            set((state) => ({
                metadata: {...state.metadata, states},
            }));
        } catch (err) {
            console.error("Failed to fetch states", err);
        }
    },

    fetchDistricts: async (stateName) => {
        if (!stateName) return;
        try {
            const districts = await hospitalService.getDistricts(stateName);
            set((state) => ({
                metadata: {...state.metadata, districts},
            }));
        } catch (err) {
            console.error("Failed to fetch districts", err);
        }
    },

    fetchHospitalTypes: async (stateName, district) => {
        if (!stateName) return;
        try {
            const types = await hospitalService.getHospitalTypes(stateName, district);
            set((state) => ({
                metadata: {...state.metadata, types},
            }));
        } catch (err) {
            console.error("Failed to fetch hospital types", err);
        }
    },

    searchHospitals: async (page = 0) => {
        const {filters, pagination} = get();
        if (!filters.state) {
            set({error: "Please select a state to find hospitals."});
            return;
        }

        set({isLoading: true, error: null});

        try {
            // Because filters might be simpler in UI, we pass exactly what API expects
            const apiFilters: Partial<HospitalFilters> = {
                state: filters.state,
                district: filters.district || undefined,
                hospitalType: filters.hospitalType,
                specialityIds: [],
                schemeCodes: [],
            };

            const data = await hospitalService.searchHospitals(apiFilters, page, pagination.pageSize);

            set((state) => ({
                isLoading: false,
                hospitalResults: page === 0 ? data.content : mergeHospitalPages(state.hospitalResults, data.content),
                pagination: {
                    ...state.pagination,
                    currentPage: data.number,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                },
            }));
        } catch (err) {
            set({
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to search hospitals",
            });
        }
    },

    clearDefaultHospitalType: () => set((state) => ({
        ...state,
        filters: { ...state.filters, hospitalType: null }
    })),
}));
