
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  trailingSlash: false,

  async redirects() {
    return [
      // هر درخواستی که با HOST = elororojo.es (غیر www) بیاید → مستقیم به https://www.elororojo.es/* (308)
      {
        source: "/:path*",
        has: [{ type: "host", value: "elororojo.es" }],
        destination: "https://www.elororojo.es/:path*",
        permanent: true, // = 308
      },
    ];
  },

  // اگر فقط cart/checkout را noindex می‌خواهی، این بخش را باز کن و بقیهٔ صفحات عمومی را دست نزن
  // async headers() {
  //   return [
  //     {
  //       source: "/cart",
  //       headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
  //     },
  //     {
  //       source: "/checkout",
  //       headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
  //     },
  //   ];
  // },
};

export default nextConfig;
