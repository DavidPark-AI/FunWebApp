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

// 정적 내보내기와 기존 설정 통합
module.exports = {
  ...nextConfig,
  // Cloudflare Pages에서 API 라우트가 필요하면 이 설정을 주석 해제하세요
  // output: 'export',
};
