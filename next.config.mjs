/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.verdstampdigital.app" }],
        destination: "https://verdstampdigital.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
