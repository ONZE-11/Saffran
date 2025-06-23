"use client";

import { useCart } from "@/context/cart-context";
import { Product } from "@/context/ProductsContext";
import { translations, Locale } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  product: Product;
  locale: Locale;
};

export default function ProductDetailClient({ product, locale }: Props) {
  const { addToCart } = useCart();
  const common = translations[locale].common;
  const router = useRouter();

  const [added, setAdded] = useState(false);

  const handleOrderNow = () => {
    addToCart(product.id.toString(), 1);
    router.push("/cart");
  };

  const handleAddToCart = () => {
    addToCart(product.id.toString(), 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid gap-4">
      <Button
        onClick={handleOrderNow}
        className="w-full bg-vibrant-orange-600 hover:bg-vibrant-orange-700 text-black dark:text-white text-lg shadow-md transition-all"
      >
        {common.orderNow || "Order Now"}
      </Button>

      <Button
        onClick={handleAddToCart}
        className="w-full border border-vibrant-orange-600 bg-transparent hover:bg-vibrant-orange-50 dark:hover:bg-vibrant-orange-900 text-vibrant-orange-700 dark:text-vibrant-orange-400 text-md shadow-sm flex items-center justify-center gap-2 transition"
      >
        <ShoppingCartIcon className="w-5 h-5" />
        {added
          ? locale === "es"
            ? "Añadido"
            : "Added"
          : locale === "es"
          ? "Agregar al carrito"
          : "Add to Cart"}
      </Button>
    </div>
  );
}
