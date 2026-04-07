import type { NextConfig } from "next";

const allowedDevOrigins = ["localhost", "127.0.0.1"];
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (configuredApiUrl) {
  try {
    allowedDevOrigins.push(new URL(configuredApiUrl).hostname);
  } catch {
    // Ignore malformed local env values during development.
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: Array.from(new Set(allowedDevOrigins)),
};

export default nextConfig;
