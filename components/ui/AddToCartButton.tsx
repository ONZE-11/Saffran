"use client";

import { useCart } from "@/context/cart-context";
import { useSearchParams } from "next/navigation";

type Props = {
  productId: string;
};

export default function AddToCartButton({ productId }: Props) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  const label = lang === "es" ? "Añadir al carrito" : "Add to Cart";

  return (
    <button
      onClick={() => addToCart(productId, 1)}
      className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
    >
      {label}
    </button>
  );
}
