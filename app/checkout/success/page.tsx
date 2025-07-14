"use client";

import { useLocale } from "@/context/locale-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  const { locale } = useLocale();

  const texts = {
    en: {
      successTitle: "🎉 Order Placed Successfully!",
      successMessage: "Thank you for your order. We’ll contact you shortly.",
      backToShop: "Back to Shop",
    },
    es: {
      successTitle: "🎉 ¡Pedido realizado con éxito!",
      successMessage: "Gracias por su pedido. Nos pondremos en contacto pronto.",
      backToShop: "Volver a la tienda",
    },
  };

  const t = texts[locale ?? "en"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">{t.successTitle}</h1>
      <p className="text-lg mb-6">{t.successMessage}</p>
      <Link href="/products">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg">
          {t.backToShop}
        </Button>
      </Link>
    </div>
  );
}
