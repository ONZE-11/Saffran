/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  trailingSlash: false,

  async redirects() {
    return [
      // هر مسیر → https://www.elororojo.es
      {
        source: '/:path*',
        destination: 'https://www.elororojo.es/:path*',
        permanent: true, // 301 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
