import type { NextConfig } from "next";

// In production (Vercel), set API_SERVER_URL to your Railway backend URL,
// e.g. https://lingua-live-api.railway.app
// In development it falls back to localhost:3001 via the rewrite proxy.
const API_SERVER = process.env.API_SERVER_URL ?? "http://localhost:3001";
const IS_PROD = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "LinguaLive AI",
    // Expose the socket URL to the browser bundle.
    // In production this must be the Railway HTTPS URL (wss:// is derived from it).
    // In dev it's empty — VoiceCall falls back to window.location.origin.
    NEXT_PUBLIC_SOCKET_URL: IS_PROD ? (process.env.API_SERVER_URL ?? "") : "",
  },
  // Dev-only proxy: forwards /api/* and /ws-voice to the local Express server.
  // In production Vercel cannot proxy WebSockets, so the client connects
  // directly to NEXT_PUBLIC_SOCKET_URL (the Railway URL).
  ...(!IS_PROD && {
    async rewrites() {
      return [
        { source: "/api/:path*",  destination: `${API_SERVER}/api/:path*` },
        { source: "/ws-voice",    destination: `${API_SERVER}/ws-voice` },
      ];
    },
  }),
};

export default nextConfig;
