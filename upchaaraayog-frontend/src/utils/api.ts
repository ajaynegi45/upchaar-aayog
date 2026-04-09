const DEFAULT_BACKEND_PORT = "8080";

export function getApiBaseUrl(): string {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, "");
    }

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_BACKEND_PORT}`;
    }

    return `http://localhost:${DEFAULT_BACKEND_PORT}`;
}
