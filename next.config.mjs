/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // ⛔ swcMinify را حذف کردیم
  // ⛔ experimental.esmExternals هم لازم نیست
};

export default nextConfig;
