import type { NextConfig } from "next";

const nextConfig = {
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
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
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
    typescript: {
        ignoreBuildErrors: true,
    },
} as any;

export default nextConfig as NextConfig;
