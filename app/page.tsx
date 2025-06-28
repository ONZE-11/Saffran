"use client";

import { useProducts } from "@/context/ProductsContext";
import { useLocale } from "@/context/locale-context";
import { translations } from "@/lib/translations";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart } from "@/context/cart-context";

export default function HomePage() {
  const products = useProducts();
  const { locale } = useLocale();
  const t = translations[locale].homepage;
  const c = translations[locale].common;
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SiteHeader />
      <main className="flex-1 animate-fade-in">

        {/* Featured Products Section */}
        <section className="py-20 bg-background text-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-10">
              <h2 className="text-3xl md:text-4xl font-bold font-serif">
                {t.featuredProductsTitle}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                {t.featuredProductsDescription}
              </p>

              {/* نیم‌دایره نمایش محصولات */}
              <div className="relative w-full max-w-6xl h-[340px]">
                {products.slice(0, 7).map((product, index, arr) => {
                  const count = arr.length;
                  const angle = (index / (count - 1)) * Math.PI;
                  const radius = 240;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);

                  return (
                    <div
                      key={product.id}
                      className="absolute transition-transform duration-300 hover:scale-105"
                      style={{
                        left: `calc(50% + ${x}px - 100px)`,
                        top: `calc(${radius - y}px)`,
                      }}
                    >
                      <Link href={`/products/${product.id}`} prefetch={false}>
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.alt}
                          width={200}
                          height={200}
                          className="rounded-full border-4 border-white shadow-md object-cover w-[200px] h-[200px]"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* دکمه ورود به صفحه فروشگاه */}
              <Link href="/products" prefetch={false}>
                <Button className="bg-gradient-to-r from-vibrant-orange-600 to-vibrant-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
                  {c.shop}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-muted text-foreground">
          <div className="container px-4 md:px-6 text-center space-y-6">
            <h2 className="text-3xl font-bold">{t.aboutTitle}</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              {t.aboutText}
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-background text-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-10">{t.whyChooseUsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{t.featureQuality}</h3>
                <p className="text-muted-foreground">{t.featureQualityText}</p>
              </div>
              <div className="bg-muted p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{t.featureExport}</h3>
                <p className="text-muted-foreground">{t.featureExportText}</p>
              </div>
              <div className="bg-muted p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{t.featureSupport}</h3>
                <p className="text-muted-foreground">{t.featureSupportText}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
