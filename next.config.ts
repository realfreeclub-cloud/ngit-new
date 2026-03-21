import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "ngit.org.in",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.freepik.com",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: "geolocation=*",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
