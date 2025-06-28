import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Product } from "@/context/ProductsContext";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckCircleIcon, PackageIcon, LeafIcon } from "lucide-react";
import Image from "next/image";
import { translations, Locale } from "@/lib/translations";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic"; // برای دریافت داده به‌روز در هر رندر
// Trigger redeploy: Product detail dynamic route
type Props = {
  params: { id: string };
  searchParams?: { lang?: string }; // پشتیبانی از ?lang=es
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = params;

  // 1. ساختن آدرس API درست
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // fallback for dev

  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  // 2. تشخیص زبان از پارامتر یا هدر
  const langParam = searchParams?.lang;
  const acceptLanguage = (await headers()).get("accept-language") || "en";

  const locale: Locale =
    langParam === "es" || langParam === "en"
      ? langParam
      : acceptLanguage.includes("es")
      ? "es"
      : "en";

  const common = translations[locale].common;

  // 3. تنظیم آدرس تصویر
  const fullImageUrl = product.image_url.startsWith("http")
    ? product.image_url
    : `/${product.image_url}`;

  // 4. رندر صفحه
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20 animate-fade-in">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* تصویر محصول */}
          <div className="relative w-full h-80 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={fullImageUrl || "/placeholder.svg"}
              alt={locale === "es" ? product.title_es : product.title_en}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="grid gap-6">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
              {locale === "es" ? product.title_es : product.title_en}
            </h1>

            <p className="text-muted-foreground text-lg mt-4">
              {locale === "es"
                ? product.description_es
                : product.description_en}
            </p>

            {/* قیمت */}
            {product.originalPrice &&
            Number(product.originalPrice) > Number(product.price) ? (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                  €{Number(product.price).toFixed(2)}
                </span>
                <span className="text-muted-foreground line-through">
                  €{Number(product.originalPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                  €{Number(product.originalPrice || product.price).toFixed(2)}
                </span>
              </div>
            )}

            <ul className="grid gap-2 text-muted-foreground mt-4">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-vibrant-orange-600" />
                <span>{common.fastDelivery}</span>
              </li>
              <li className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-vibrant-orange-600" />
                <span>{common.securePackaging}</span>
              </li>
              <li className="flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-vibrant-orange-600" />
                <span>{common.naturalProduct}</span>
              </li>
            </ul>

            {/* دکمه سفارش */}
            <ProductDetailClient product={product} locale={locale} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
