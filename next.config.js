/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Use appropriate experimental options for Next.js 15.x
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

//module.exports = nextConfig
module.exports = {
  output: 'export',  // ✅ 정적 사이트로 내보내기
};
