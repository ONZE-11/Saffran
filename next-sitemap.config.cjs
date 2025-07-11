/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://elororojo.es", // 🔥 آدرس دامنه‌ات
  generateRobotsTxt: true, // (اختیاری) robots.txt هم بسازد
  sitemapSize: 7000, // تعداد URL در هر فایل سایت‌مپ
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin/*"], // صفحاتی که نمی‌خواهی ایندکس شوند
};