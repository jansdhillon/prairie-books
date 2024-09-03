/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        ADMIN_USERNAME: process.env.ADMIN_USERNAME,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    },
}

module.exports = nextConfig
