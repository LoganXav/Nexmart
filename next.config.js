/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.istockphoto.com",
      },
    ],
    domains: ["uploadthing.com", "utfs.io"],
  },
};

module.exports = nextConfig;
