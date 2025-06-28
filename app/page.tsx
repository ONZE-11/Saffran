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
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const products = useProducts();
  const { locale } = useLocale();
  const t = translations[locale].homepage;
  const c = translations[locale].common;
  const { addToCart } = useCart();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 30;
      setAtEnd(reachedEnd);
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll(); // initial check
    }

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SiteHeader />
      <main className="flex-1 animate-fade-in">
        <section className="py-20 bg-background text-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-10">
              <h2 className="text-3xl md:text-4xl font-bold font-serif">
                {t.featuredProductsTitle}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                {t.featuredProductsDescription}
              </p>

              {/* موبایل: اسکرول افقی با فلش راهنما */}
              <div className="md:hidden relative px-4 py-6">
                {!atEnd && (
                  <button
                    onClick={() =>
                      scrollRef.current?.scrollBy({
                        left: 200,
                        behavior: "smooth",
                      })
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow hover:scale-105 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                <div
                  ref={scrollRef}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide pr-8 scroll-smooth"
                >
                  {products.slice(0, 7).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex-shrink-0"
                      prefetch={false}
                    >
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.alt}
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-white shadow-md object-cover w-[120px] h-[120px]"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* دسکتاپ: نیم‌دایره */}
              <div className="hidden md:block relative w-full max-w-6xl h-[360px]">
                {products.slice(0, 7).map((product, index, arr) => {
                  const count = arr.length;
                  const angle = (index / (count - 1)) * Math.PI;
                  const radius = 220;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);

                  return (
                    <div
                      key={product.id}
                      className="absolute transition-transform duration-300 hover:scale-105"
                      style={{
                        left: `calc(50% + ${x}px - 90px)`,
                        top: `calc(${radius - y}px)`,
                      }}
                    >
                      <Link href={`/products/${product.id}`} prefetch={false}>
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.alt}
                          width={180}
                          height={180}
                          className="rounded-full border-4 border-white shadow-md object-cover w-[180px] h-[180px]"
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
                <h3 className="text-xl font-semibold mb-2">
                  {t.featureQuality}
                </h3>
                <p className="text-muted-foreground">{t.featureQualityText}</p>
              </div>
              <div className="bg-muted p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">
                  {t.featureExport}
                </h3>
                <p className="text-muted-foreground">{t.featureExportText}</p>
              </div>
              <div className="bg-muted p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">
                  {t.featureSupport}
                </h3>
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
