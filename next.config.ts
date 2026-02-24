import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    images: {
        domains: ["res.cloudinary.com", "images.unsplash.com"],
    },
};

export default nextConfig;
