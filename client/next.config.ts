import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from local network IPs during development
  allowedDevOrigins: [
    "http://10.15.10.202:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // Add your local network IP range
    "http://10.15.10.*:3000",
    "http://192.168.*.*:3000",
  ],
};

export default nextConfig;
