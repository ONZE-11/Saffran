/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  trailingSlash: false,

  async redirects() {
    return [
      // هر چیزی غیر www → نسخه نهایی https://www.elororojo.es
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'elororojo.es' }], // غیر www
        destination: 'https://www.elororojo.es/:path*',
        permanent: true, // 301 Permanent Redirect
      },
      // http → https (همه مسیرها)
      {
        source: '/:path*',
        has: [{ type: 'scheme', value: 'http' }],
        destination: 'https://www.elororojo.es/:path*',
        permanent: true, // 301 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
