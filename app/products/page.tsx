"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLocale } from "@/context/locale-context";
import { FilterIcon, SortAscIcon } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductsPage() {
  const { locale, t } = useLocale();
  const products = useProducts();
  const { addToCart } = useCart();
  const router = useRouter();

  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAddToCartOnly = (productId: string) => {
    addToCart(productId, 1);
    setAddedIds((prev) => [...prev, productId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== productId));
    }, 1500);
  };

  const handleAddToCartAndRedirect = (productId: string) => {
    addToCart(productId, 1);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-foreground">
              {t("productsPage.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("productsPage.description")}
            </p>
          </div>

          <div className="flex justify-end gap-4 mb-8">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{t("productsPage.filter")}</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <SortAscIcon className="h-4 w-4" />
              <span>{t("productsPage.sortBy")}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 bg-card flex flex-col"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="block"
                  prefetch={false}
                >
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.alt}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <CardContent className="p-4 text-center flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 font-serif text-foreground">
                    {locale === "es" ? product.title_es : product.title_en}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-2 min-h-[48px]">
                    {locale === "es"
                      ? product.description_es
                      : product.description_en}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                      €{Number(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through">
                        €{Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto space-y-3">
                    <Button
                      onClick={() => handleAddToCartOnly(product.id.toString())}
                      className="w-full py-3 font-semibold rounded-lg bg-vibrant-orange-600 text-white hover:bg-vibrant-orange-500 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {addedIds.includes(product.id.toString())
                        ? locale === "es"
                          ? "Añadido"
                          : "Added"
                        : locale === "es"
                        ? "Agregar al carrito"
                        : "Add to Cart"}
                    </Button>

                    <Button
                      onClick={() =>
                        handleAddToCartAndRedirect(product.id.toString())
                      }
                      className="w-full bg-gradient-to-r from-vibrant-orange-600 to-vibrant-pink-600 hover:from-vibrant-orange-700 hover:to-vibrant-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                    >
                      {locale === "es" ? "Pedir ahora" : "Order Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
