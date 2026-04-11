import {getApiBaseUrl} from "@/utils/api";
import {Location} from "@/store/types";

export interface KendraSearchResponse {
    content: unknown[];
    number: number;
    totalPages: number;
    totalElements: number;
}

export const kendraService = {
    searchStores: async (location: Location, page: number, size: number): Promise<KendraSearchResponse> => {
        const queryParams = new URLSearchParams({
            state: location.state,
            district: location.district,
            pageNumber: page.toString(),
            pageSize: size.toString(),
        });

        if (location.pincode) {
            queryParams.append("pincode", location.pincode);
        }

        const response = await fetch(
            `${getApiBaseUrl()}/api/v1/jan-aushadhi-kendra?${queryParams.toString()}`,
            {
                next: {
                    revalidate: 604800, // 7 days
                    tags: ["kendra-search"]
                }
            }

        );

        if (!response.ok) {
            throw new Error("Failed to fetch stores");
        }

        return response.json() as Promise<KendraSearchResponse>;
    }
};
