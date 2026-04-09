/**
 * Opens the provided address in the device's native map application.
 * Redirects to Apple Maps on iOS/macOS and Google Maps on other platforms.
 *
 * @param address - The full address or location name to search for.
 */
export const openInMaps = (address: string) => {
    if (!address) return;

    const encodedAddress = encodeURIComponent(address);

    // Detect Apple devices (iPhone, iPad, Mac)
    const isApple = typeof window !== "undefined" &&
        (/Mac|iPhone|iPod|iPad/.test(navigator.userAgent));

    const mapUrl = isApple
        ? `maps://maps.apple.com/?q=${encodedAddress}`
        : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    window.open(mapUrl, "_blank");
};
