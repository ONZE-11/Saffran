/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  trailingSlash: false,

  async redirects() {
    return [
      {
        // همه درخواست‌ها به هر نسخه (http/https، www/non-www) → نسخه نهایی https://www.elororojo.es
        source: "/:path*",
        has: [
          { type: "host", value: "elororojo.es" },       // non-www
        ],
        destination: "https://www.elororojo.es/:path*",
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: "/:path*",
        has: [
          { type: "scheme", value: "http" },            // http → https
        ],
        destination: "https://www.elororojo.es/:path*",
        permanent: true, // 301 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
