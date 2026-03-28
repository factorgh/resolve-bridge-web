import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.1.1.130'],
  async redirects() {
    return [
      {
        source: '/vehicles',
        destination: '/resolve-vehicles',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
