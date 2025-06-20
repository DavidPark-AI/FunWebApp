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

// Cloudflare Pages에서 파일 크기 제한으로 정적 내보내기 유지
module.exports = {
  ...nextConfig,
  output: 'export',
  // 정적 내보내기 시에도 이미지 설정 유지
  images: {
    ...nextConfig.images,
    unoptimized: true, // 정적 내보내기에서 필수
  }
};
