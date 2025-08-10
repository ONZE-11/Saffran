/** @type {import('next-sitemap').IConfig} */
// next-sitemap.config.js
module.exports = {
  siteUrl: "https://www.elororojo.es",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin/*"],
  robotsTxtOptions: {
  policies: [
    { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
  ],
},


};
