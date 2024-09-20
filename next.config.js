/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'storage.cloud.google.com',
            }
        ],
    },
}

module.exports = nextConfig
