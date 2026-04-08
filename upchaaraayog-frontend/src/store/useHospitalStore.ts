import {create} from "zustand";
import {DropdownResponse, Hospital, HospitalFilters, HospitalTypeOption, Pagination} from "./types";
import {getApiBaseUrl} from "@/utils/api";

interface HospitalMetadata {
    states: string[];
    districts: string[];
    schemes: DropdownResponse[];
    specialities: DropdownResponse[];
    types: HospitalTypeOption[];
}

interface HospitalState {
    hospitalResults: Hospital[];
    isLoading: boolean;
    isMetadataLoading: boolean;
    isSpecialitiesLoading: boolean;
    error: string | null;
    filters: HospitalFilters;
    pagination: Pagination;
    metadata: HospitalMetadata;

    // Actions
    setFilter: <K extends keyof HospitalFilters>(field: K, value: HospitalFilters[K]) => void;
    fetchStates: () => Promise<void>;
    fetchDistricts: (state: string) => Promise<void>;
    fetchRegionalMetadata: (state: string, district?: string) => Promise<void>;
    fetchSpecialities: (state: string, district?: string) => Promise<void>;
    searchHospitals: (page?: number) => Promise<void>;
    resetFilters: () => void;
}

export const DEFAULT_HOSPITAL_STATE = "NCT OF Delhi";
export const DEFAULT_HOSPITAL_TYPE = "GOVT";

const DEFAULT_PAGINATION: Pagination = {
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalElements: 0,
};
const EMPTY_DROPDOWNS: DropdownResponse[] = [];
const EMPTY_TYPES: HospitalTypeOption[] = [];

interface SearchResponse {
    content: Hospital[];
    number: number;
    totalPages: number;
    totalElements: number;
}

interface RegionalMetadataCacheEntry {
    schemes: DropdownResponse[];
    types: HospitalTypeOption[];
}

let statesCache: string[] | null = null;
let statesRequest: Promise<string[]> | null = null;

const districtCache = new Map<string, string[]>();
const districtRequests = new Map<string, Promise<string[]>>();

const regionalMetadataCache = new Map<string, RegionalMetadataCacheEntry>();
const regionalMetadataRequests = new Map<string, Promise<RegionalMetadataCacheEntry>>();

const specialityCache = new Map<string, DropdownResponse[]>();
const specialityRequests = new Map<string, Promise<DropdownResponse[]>>();

const searchCache = new Map<string, SearchResponse>();
const searchRequests = new Map<string, Promise<SearchResponse>>();

function getRegionKey(state: string, district?: string): string {
    return `${state.trim().toLowerCase()}::${district?.trim().toLowerCase() ?? ""}`;
}

function buildSearchCacheKey(filters: HospitalFilters, page: number, pageSize: number): string {
    return JSON.stringify({
        page,
        pageSize,
        state: filters.state,
        district: filters.district,
        hospitalType: filters.hospitalType,
        specialityIds: filters.specialityIds,
        schemeCodes: filters.schemeCodes,
    });
}

function buildFilterSignature(filters: HospitalFilters): string {
    return JSON.stringify({
        state: filters.state,
        district: filters.district,
        hospitalType: filters.hospitalType,
        specialityIds: filters.specialityIds,
        schemeCodes: filters.schemeCodes,
    });
}

function samePagination(a: Pagination, b: Pagination): boolean {
    return (
        a.currentPage === b.currentPage &&
        a.totalPages === b.totalPages &&
        a.pageSize === b.pageSize &&
        a.totalElements === b.totalElements
    );
}

function mergeHospitalPages(existing: Hospital[], nextPage: Hospital[]): Hospital[] {
    if (nextPage.length === 0) {
        return existing;
    }

    const seenIds = new Set(existing.map((hospital) => hospital.id));
    const unseen = nextPage.filter((hospital) => !seenIds.has(hospital.id));

    if (unseen.length === 0) {
        return existing;
    }

    return [...existing, ...unseen];
}

export const useHospitalStore = create<HospitalState>((set, get) => ({
    hospitalResults: [],
    isLoading: false,
    isMetadataLoading: false,
    isSpecialitiesLoading: false,
    error: null,
    filters: {
        state: DEFAULT_HOSPITAL_STATE,
        district: "",
        hospitalType: DEFAULT_HOSPITAL_TYPE,
        specialityIds: [],
        schemeCodes: [],
    },
    pagination: DEFAULT_PAGINATION,
    metadata: {
        states: [],
        districts: [],
        schemes: [],
        specialities: [],
        types: [],
    },

    setFilter: (field, value) => {
        const currentFilters = get().filters;
        if (currentFilters[field] === value) {
            return;
        }

        const newFilters = {...currentFilters, [field]: value};

        if (field === "state") {
            const nextState = value as string;
            const cachedDistricts = districtCache.get(nextState.trim().toLowerCase()) ?? [];
            const cachedRegionalMetadata = nextState ? regionalMetadataCache.get(getRegionKey(nextState)) : null;
            set((state) => ({
                ...state,
                error: null,
                filters: {
                    ...newFilters,
                    district: "",
                    hospitalType: null,
                    specialityIds: [],
                    schemeCodes: [],
                },
                metadata: {
                    ...state.metadata,
                    districts: cachedDistricts,
                    schemes: cachedRegionalMetadata?.schemes ?? EMPTY_DROPDOWNS,
                    specialities: EMPTY_DROPDOWNS,
                    types: cachedRegionalMetadata?.types ?? EMPTY_TYPES,
                },
            }));

            if (nextState) {
                void get().fetchDistricts(nextState);
                void get().fetchRegionalMetadata(nextState);
            }
            return;
        }

        if (field === "district") {
            const nextDistrict = value as string;
            const cachedRegionalMetadata = currentFilters.state
                ? regionalMetadataCache.get(getRegionKey(currentFilters.state, nextDistrict))
                : null;
            set((state) => ({
                ...state,
                error: null,
                filters: {
                    ...newFilters,
                    hospitalType: null,
                    specialityIds: [],
                    schemeCodes: [],
                },
                metadata: {
                    ...state.metadata,
                    schemes: cachedRegionalMetadata?.schemes ?? EMPTY_DROPDOWNS,
                    specialities: EMPTY_DROPDOWNS,
                    types: cachedRegionalMetadata?.types ?? EMPTY_TYPES,
                },
            }));

            if (currentFilters.state) {
                void get().fetchRegionalMetadata(currentFilters.state, nextDistrict);
            }
            return;
        }

        set((state) => ({
            ...state,
            error: null,
            filters: newFilters,
        }));
    },

    fetchStates: async () => {
        if (get().metadata.states.length > 0) return;

        if (statesCache) {
            set((state) =>
                state.metadata.states === statesCache
                    ? state
                    : {
                        ...state,
                        metadata: {...state.metadata, states: statesCache},
                    }
            );
            return;
        }

        if (!statesRequest) {
            statesRequest = fetch(`${getApiBaseUrl()}/api/v1/hospitals/states`)
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch states");
                    }
                    const states = (await res.json()) as string[];
                    statesCache = states;
                    return states;
                })
                .finally(() => {
                    statesRequest = null;
                });
        }

        try {
            const states = await statesRequest;
            set((state) =>
                state.metadata.states === states
                    ? state
                    : {
                        ...state,
                        metadata: {...state.metadata, states},
                    }
            );
        } catch (err) {
            console.error("Failed to fetch states", err);
        }
    },

    fetchDistricts: async (state) => {
        if (!state) return;

        const stateKey = state.trim().toLowerCase();
        const cachedDistricts = districtCache.get(stateKey);
        if (cachedDistricts) {
            set((currentState) =>
                currentState.filters.state !== state
                    ? currentState
                    : currentState.metadata.districts === cachedDistricts
                        ? currentState
                        : {
                            ...currentState,
                            metadata: {...currentState.metadata, districts: cachedDistricts},
                        }
            );
            return;
        }

        if (!districtRequests.has(stateKey)) {
            districtRequests.set(
                stateKey,
                fetch(`${getApiBaseUrl()}/api/v1/hospitals/districts?state=${encodeURIComponent(state)}`)
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Failed to fetch districts");
                        }
                        const districts = (await res.json()) as string[];
                        districtCache.set(stateKey, districts);
                        return districts;
                    })
                    .finally(() => {
                        districtRequests.delete(stateKey);
                    })
            );
        }

        try {
            const districts = await districtRequests.get(stateKey)!;
            set((currentState) =>
                currentState.filters.state !== state
                    ? currentState
                    : currentState.metadata.districts === districts
                        ? currentState
                        : {
                            ...currentState,
                            metadata: {...currentState.metadata, districts},
                        }
            );
        } catch (err) {
            console.error("Failed to fetch districts", err);
        }
    },

    fetchRegionalMetadata: async (state, district) => {
        if (!state) return;

        const regionKey = getRegionKey(state, district);
        const cachedMetadata = regionalMetadataCache.get(regionKey);

        if (cachedMetadata) {
            set((currentState) =>
                currentState.filters.state !== state || currentState.filters.district !== (district ?? "")
                    ? currentState
                    : currentState.metadata.schemes === cachedMetadata.schemes &&
                    currentState.metadata.types === cachedMetadata.types
                        ? currentState
                        : {
                            ...currentState,
                            metadata: {
                                ...currentState.metadata,
                                schemes: cachedMetadata.schemes,
                                types: cachedMetadata.types,
                            },
                        }
            );
            return;
        }

        set((stateValue) => (stateValue.isMetadataLoading ? stateValue : {...stateValue, isMetadataLoading: true}));

        if (!regionalMetadataRequests.has(regionKey)) {
            const query = `?state=${encodeURIComponent(state)}${district ? `&district=${encodeURIComponent(district)}` : ""}`;
            regionalMetadataRequests.set(
                regionKey,
                Promise.all([
                    fetch(`${getApiBaseUrl()}/api/v1/hospitals/schemes${query}`),
                    fetch(`${getApiBaseUrl()}/api/v1/hospitals/types${query}`),
                ])
                    .then(async ([schemesRes, typesRes]) => {
                        const [schemes, types] = await Promise.all([
                            schemesRes.ok ? ((await schemesRes.json()) as DropdownResponse[]) : Promise.resolve(EMPTY_DROPDOWNS),
                            typesRes.ok ? ((await typesRes.json()) as HospitalTypeOption[]) : Promise.resolve(EMPTY_TYPES),
                        ]);

                        const metadata = {schemes, types};
                        regionalMetadataCache.set(regionKey, metadata);
                        return metadata;
                    })
                    .finally(() => {
                        regionalMetadataRequests.delete(regionKey);
                    })
            );
        }

        try {
            const metadata = await regionalMetadataRequests.get(regionKey)!;
            set((currentState) =>
                currentState.filters.state !== state || currentState.filters.district !== (district ?? "")
                    ? {...currentState, isMetadataLoading: false}
                    : {
                        ...currentState,
                        isMetadataLoading: false,
                        metadata: {
                            ...currentState.metadata,
                            schemes: metadata.schemes,
                            types: metadata.types,
                        },
                    }
            );
        } catch (err) {
            console.error("Failed to fetch regional metadata", err);
            set((stateValue) => ({...stateValue, isMetadataLoading: false}));
        }
    },

    fetchSpecialities: async (state, district) => {
        if (!state) return;

        const regionKey = getRegionKey(state, district);
        const cachedSpecialities = specialityCache.get(regionKey);
        if (cachedSpecialities) {
            set((currentState) =>
                currentState.filters.state !== state || currentState.filters.district !== (district ?? "")
                    ? currentState
                    : currentState.metadata.specialities === cachedSpecialities
                        ? currentState
                        : {
                            ...currentState,
                            metadata: {...currentState.metadata, specialities: cachedSpecialities},
                        }
            );
            return;
        }

        set((stateValue) =>
            stateValue.isSpecialitiesLoading ? stateValue : {...stateValue, isSpecialitiesLoading: true}
        );

        if (!specialityRequests.has(regionKey)) {
            const query = `?state=${encodeURIComponent(state)}${district ? `&district=${encodeURIComponent(district)}` : ""}`;
            specialityRequests.set(
                regionKey,
                fetch(`${getApiBaseUrl()}/api/v1/hospitals/specialities${query}`)
                    .then(async (res) => {
                        const specialities = res.ok ? ((await res.json()) as DropdownResponse[]) : EMPTY_DROPDOWNS;
                        specialityCache.set(regionKey, specialities);
                        return specialities;
                    })
                    .finally(() => {
                        specialityRequests.delete(regionKey);
                    })
            );
        }

        try {
            const specialities = await specialityRequests.get(regionKey)!;
            set((currentState) =>
                currentState.filters.state !== state || currentState.filters.district !== (district ?? "")
                    ? {...currentState, isSpecialitiesLoading: false}
                    : {
                        ...currentState,
                        isSpecialitiesLoading: false,
                        metadata: {...currentState.metadata, specialities},
                    }
            );
        } catch (err) {
            console.error("Failed to fetch specialities", err);
            set((stateValue) => ({...stateValue, isSpecialitiesLoading: false}));
        }
    },

    searchHospitals: async (page = 0) => {
        const {filters, pagination} = get();
        if (!filters.state) {
            set((state) => ({...state, error: "Please select a state to find hospitals."}));
            return;
        }

        const activeFilterSignature = buildFilterSignature(filters);
        const cacheKey = buildSearchCacheKey(filters, page, pagination.pageSize);
        const cachedResponse = searchCache.get(cacheKey);
        if (cachedResponse) {
            set((state) => {
                if (buildFilterSignature(state.filters) !== activeFilterSignature) {
                    return state;
                }

                const nextResults = page === 0 ? cachedResponse.content : mergeHospitalPages(state.hospitalResults, cachedResponse.content);
                const nextPagination: Pagination = {
                    ...state.pagination,
                    currentPage: cachedResponse.number,
                    totalPages: cachedResponse.totalPages,
                    totalElements: cachedResponse.totalElements,
                };

                if (
                    state.hospitalResults === nextResults &&
                    samePagination(state.pagination, nextPagination) &&
                    state.error === null
                ) {
                    return state;
                }

                return {
                    ...state,
                    error: null,
                    hospitalResults: nextResults,
                    pagination: nextPagination,
                };
            });
            return;
        }

        set((state) => (state.isLoading && state.error === null ? state : {...state, isLoading: true, error: null}));

        if (!searchRequests.has(cacheKey)) {
            searchRequests.set(
                cacheKey,
                fetch(`${getApiBaseUrl()}/api/v1/hospitals/search?page=${page}&size=${pagination.pageSize}`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(filters),
                })
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Failed to fetch hospitals");
                        }
                        const data = (await res.json()) as SearchResponse;
                        searchCache.set(cacheKey, data);
                        return data;
                    })
                    .finally(() => {
                        searchRequests.delete(cacheKey);
                    })
            );
        }

        try {
            const data = await searchRequests.get(cacheKey)!;
            set((state) =>
                buildFilterSignature(state.filters) !== activeFilterSignature
                    ? {...state, isLoading: false}
                    : {
                        ...state,
                        isLoading: false,
                        hospitalResults: page === 0 ? data.content : mergeHospitalPages(state.hospitalResults, data.content),
                        pagination: {
                            ...state.pagination,
                            currentPage: data.number,
                            totalPages: data.totalPages,
                            totalElements: data.totalElements,
                        },
                    }
            );
        } catch (err) {
            set((state) => ({
                ...state,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to search hospitals",
            }));
        }
    },

    resetFilters: () =>
        set((state) => ({
            ...state,
            filters: {
                state: DEFAULT_HOSPITAL_STATE,
                district: "",
                hospitalType: null,
                specialityIds: [],
                schemeCodes: [],
            },
            error: null,
            hospitalResults: [],
            metadata: {
                ...state.metadata,
                districts: districtCache.get(DEFAULT_HOSPITAL_STATE.trim().toLowerCase()) ?? [],
                schemes: regionalMetadataCache.get(getRegionKey(DEFAULT_HOSPITAL_STATE))?.schemes ?? EMPTY_DROPDOWNS,
                specialities: EMPTY_DROPDOWNS,
                types: regionalMetadataCache.get(getRegionKey(DEFAULT_HOSPITAL_STATE))?.types ?? EMPTY_TYPES,
            },
            pagination: DEFAULT_PAGINATION,
        })),
}));
