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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const { locale, t } = useLocale();
  const products = useProducts();
  const { addToCart } = useCart();
  const router = useRouter();

  const [addedIds, setAddedIds] = useState<string[]>([]);
  const initialPriceRange = { min: 0, max: 1000 };
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [sortOrder, setSortOrder] = useState<"low" | "high" | "newest" | null>(
    null
  );
  const [filterOpen, setFilterOpen] = useState(false);

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

  const filteredAndSortedProducts = products
    .filter((product) => {
      const price = Number(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return Number(a.price) - Number(b.price);
      if (sortOrder === "high") return Number(b.price) - Number(a.price);
      if (sortOrder === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-foreground">
              {t("productDetailPage.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("productDetailPage.description")}
            </p>
          </div>

          <div className="flex justify-end gap-4 mb-8">
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-semibold border border-yellow-500 text-yellow-600 bg-white dark:bg-background hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-600 dark:hover:text-white"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span>{t("productDetailPage.filter")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-4 bg-white dark:bg-[#1a1a1a]"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-muted-foreground">
                    {locale === "es" ? "Rango de precio" : "Price Range"}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min || ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          setPriceRange((prev) => ({
                            ...prev,
                            min: isNaN(val) ? 0 : val,
                          }));
                        }}
                        className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white focus:outline-none focus:ring focus:ring-yellow-400"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max || ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          setPriceRange((prev) => ({
                            ...prev,
                            max: isNaN(val) ? 0 : val,
                          }));
                        }}
                        className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white focus:outline-none focus:ring focus:ring-yellow-400"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-700 dark:text-yellow-400"
                        onClick={() => {
                          setPriceRange(initialPriceRange);
                        }}
                      >
                        {locale === "es" ? "Reiniciar" : "Reset"}
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        onClick={() => setFilterOpen(false)}
                      >
                        {locale === "es" ? "Aplicar" : "Apply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-semibold border border-yellow-500 text-yellow-600 bg-white dark:bg-background hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-600 dark:hover:text-white"
                >
                  <SortAscIcon className="h-4 w-4" />
                  <span>{t("productDetailPage.sortBy")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-2"
              >
                <DropdownMenuItem
                  onClick={() => setSortOrder("low")}
                  className="text-muted-foreground data-[highlighted]:bg-[#f4c430] data-[highlighted]:text-black dark:data-[highlighted]:bg-[#d4a500] dark:data-[highlighted]:text-white px-3 py-2 text-sm rounded-md cursor-pointer"
                >
                  {t("productDetailPage.priceLowToHigh")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortOrder("high")}
                  className="text-muted-foreground data-[highlighted]:bg-[#f4c430] data-[highlighted]:text-black dark:data-[highlighted]:bg-[#d4a500] dark:data-[highlighted]:text-white px-3 py-2 text-sm rounded-md cursor-pointer"
                >
                  {t("productDetailPage.priceHighToLow")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortOrder("newest")}
                  className="text-muted-foreground data-[highlighted]:bg-[#f4c430] data-[highlighted]:text-black dark:data-[highlighted]:bg-[#d4a500] dark:data-[highlighted]:text-white px-3 py-2 text-sm rounded-md cursor-pointer"
                >
                  {t("productDetailPage.newest")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
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
                   {product.originalPrice &&
  Number(product.originalPrice) > Number(product.price) && (
    <span className="text-muted-foreground line-through">
      €{Number(product.originalPrice).toFixed(2)}
    </span>
)}

                  </div>
                  <div className="mt-auto space-y-3">
                    <Button
                      onClick={() => handleAddToCartOnly(product.id.toString())}
                      className="w-full py-3 font-semibold rounded-lg bg-vibrant-orange-600 text-black dark:text-white hover:bg-vibrant-orange-500 shadow-sm hover:shadow-md transition-all duration-300"

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
