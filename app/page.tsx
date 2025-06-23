"use client";

import { Product, useProducts } from "@/context/ProductsContext";
import { useLocale } from "@/context/locale-context";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeafIcon, AwardIcon, HeartIcon } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const products = useProducts();
  const { locale, t } = useLocale();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    addToCart(product.id.toString()); // 👈 فقط ID را ارسال می‌کنیم
    router.push("/cart");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SiteHeader />
      <main className="flex-1 animate-fade-in">
        {/* Hero Section */}
        {/* ... همان کدهای قبلی ... */}

        {/* Featured Products Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-muted via-muted/50 to-background text-foreground shadow-inner">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-vibrant-orange-700 drop-shadow-lg">
                {t("homepage.featuredProductsTitle")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto drop-shadow-sm">
                {t("homepage.featuredProductsDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-3 bg-gradient-to-br from-card to-muted/30 border-2 border-transparent hover:border-vibrant-orange-200/50"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                    prefetch={false}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.alt}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-xl font-semibold mb-2 font-serif drop-shadow-sm">
                      {locale === "en" ? product.title_en : product.title_es}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {locale === "en"
                        ? product.description_en
                        : product.description_es}
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-2">
                        {product.originalPrice &&
                        Number(product.originalPrice) >
                          Number(product.price) ? (
                          <>
                            <span className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                              €{Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-muted-foreground line-through text-lg">
                              €{Number(product.originalPrice).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                            €
                            {Number(
                              product.originalPrice || product.price
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* دکمه اضافه کردن به سبد خرید و هدایت */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-vibrant-orange-600 to-vibrant-pink-600 hover:from-vibrant-orange-700 hover:to-vibrant-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {t("common.orderNow")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* بخش‌های دیگر ... */}
      </main>
      <SiteFooter />
    </div>
  );
}
