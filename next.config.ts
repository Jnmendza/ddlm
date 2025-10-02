import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "nargtjqnjvwljfhrzvmk.supabase.co",
      },
    ],
  },
};

export default withNextVideo(nextConfig);
