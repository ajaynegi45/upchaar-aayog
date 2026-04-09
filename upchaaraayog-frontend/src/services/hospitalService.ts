import {getApiBaseUrl} from "@/utils/api";
import {Hospital, HospitalFilters, HospitalTypeOption} from "@/store/types";

export interface SearchResponse {
    content: Hospital[];
    number: number;
    totalPages: number;
    totalElements: number;
}

const cache = new Map<string, any>();

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (cache.has(key)) {
        return cache.get(key) as T;
    }
    const data = await fetcher();
    cache.set(key, data);
    return data;
}

export const hospitalService = {
    getStates: () => fetchWithCache('states', async () => {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/hospitals/states`);
        if (!res.ok) throw new Error("Failed to fetch states");
        return await res.json() as Promise<string[]>;
    }),

    getDistricts: (state: string) => fetchWithCache(`districts-${state}`, async () => {
        if (!state) return [];
        const res = await fetch(`${getApiBaseUrl()}/api/v1/hospitals/districts?state=${encodeURIComponent(state)}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        return await res.json() as Promise<string[]>;
    }),

    getHospitalTypes: (state: string, district?: string) => {
        if (!state) return Promise.resolve([]);
        const query = `?state=${encodeURIComponent(state)}${district ? `&district=${encodeURIComponent(district)}` : ""}`;
        return fetchWithCache(`types-${state}-${district}`, async () => {
            const res = await fetch(`${getApiBaseUrl()}/api/v1/hospitals/types${query}`);
            if (!res.ok) return [];
            return await res.json() as Promise<HospitalTypeOption[]>;
        });
    },

    searchHospitals: async (filters: Partial<HospitalFilters>, page: number, size: number): Promise<SearchResponse> => {
        const cacheKey = JSON.stringify({filters, page, size});
        return fetchWithCache(`search-${cacheKey}`, async () => {
            const res = await fetch(`${getApiBaseUrl()}/api/v1/hospitals/search?page=${page}&size=${size}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(filters),
            });
            if (!res.ok) throw new Error("Failed to fetch hospitals");
            return await res.json() as Promise<SearchResponse>;
        });
    }
};
