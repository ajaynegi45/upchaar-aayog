import { getApiBaseUrl } from "@/utils/api";
import { Hospital, HospitalFilters, HospitalTypeOption } from "@/store/types";

export interface SearchResponse {
    content: Hospital[];
    number: number;
    totalPages: number;
    totalElements: number;
}

const SEVEN_DAYS = 604800;

export const hospitalService = {
    getStates: async (): Promise<string[]> => {
        const res = await fetch(
            `${getApiBaseUrl()}/api/v1/hospitals/states`,
            {
                next: {
                    revalidate: SEVEN_DAYS,
                    tags: ["hospital-states"]
                }
            }
        );

        if (!res.ok) throw new Error("Failed to fetch states");
        return res.json();
    },

    getDistricts: async (state: string): Promise<string[]> => {
        if (!state) return [];

        const res = await fetch(
            `${getApiBaseUrl()}/api/v1/hospitals/districts?state=${encodeURIComponent(state)}`,
            {
                next: {
                    revalidate: SEVEN_DAYS,
                    tags: ["hospital-districts"]
                }
            }
        );

        if (!res.ok) throw new Error("Failed to fetch districts");
        return res.json();
    },

    getHospitalTypes: async (state: string, district?: string): Promise<HospitalTypeOption[]> => {
        if (!state) return [];

        const query = `?state=${encodeURIComponent(state)}${
            district ? `&district=${encodeURIComponent(district)}` : ""
        }`;

        const res = await fetch(
            `${getApiBaseUrl()}/api/v1/hospitals/types${query}`,
            {
                next: {
                    revalidate: SEVEN_DAYS,
                    tags: ["hospital-types"]
                }
            }
        );

        if (!res.ok) return [];
        return res.json();
    },

    searchHospitals: async (
        filters: Partial<HospitalFilters>,
        page: number,
        size: number
    ): Promise<SearchResponse> => {
        const res = await fetch(
            `${getApiBaseUrl()}/api/v1/hospitals/search?page=${page}&size=${size}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters),
                next: {
                    revalidate: SEVEN_DAYS,
                    tags: ["hospital-search"]
                }
            }
        );

        if (!res.ok) throw new Error("Failed to fetch hospitals");
        return res.json();
    }
};