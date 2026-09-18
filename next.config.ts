import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone chỉ dùng khi build Docker, Vercel tự xử lý
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
