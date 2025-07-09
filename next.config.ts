import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fx7hz5pswz.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
