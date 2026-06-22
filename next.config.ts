import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/kontingent",
        destination: "/beschaffung",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
