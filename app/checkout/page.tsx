"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/locale-context";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { toast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { locale } = useLocale();
  const router = useRouter();

  // 🚫 سبد خرید خالی → ریدایرکت
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/products");
    }
  }, [cartItems]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    unitNumber: "",
    additionalInfo: "",
  });

  const texts = {
    en: {
      title: "Contact & Shipping Information",
      name: "Full Name",
      phone: "Phone Number",
      email: "Email",
      street: "Street Address",
      unitNumber: "Unit / Apartment Number",
      city: "City",
      postalCode: "Postal Code",
      additionalInfo: "Additional Info (optional)",
      submit: "Submit Order Request",
      success: "Your order request was received. We will contact you shortly.",
    },
    es: {
      title: "Información de Contacto y Envío",
      name: "Nombre Completo",
      phone: "Número de Teléfono",
      email: "Correo Electrónico",
      street: "Dirección",
      unitNumber: "Número de Unidad / Apartamento",
      city: "Ciudad",
      postalCode: "Código Postal",
      additionalInfo: "Información Adicional (opcional)",
      submit: "Enviar Solicitud de Pedido",
      success: "Su solicitud de pedido ha sido recibida. Nos pondremos en contacto con usted pronto.",
    },
  };

  const t = texts[locale ?? "en"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${form.street}, Unit ${form.unitNumber}, ${form.city}, ${form.postalCode}. ${form.additionalInfo}`;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          address: fullAddress,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: t.success, duration: 4000 });
        clearCart();
        router.push("/products");
      } else {
        console.error("Order failed", data.error);
        alert("❌ Order failed");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("❌ Unexpected error during order submission");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-xl mx-auto px-4 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-6">
            {t.title}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl shadow-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          >
            <Input
              name="name"
              placeholder={t.name}
              value={form.name}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="phone"
              placeholder={t.phone}
              value={form.phone}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="email"
              type="email"
              placeholder={t.email}
              value={form.email}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="street"
              placeholder={t.street}
              value={form.street}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="unitNumber"
              placeholder={t.unitNumber}
              value={form.unitNumber}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="city"
              placeholder={t.city}
              value={form.city}
              onChange={handleChange}
              required
              className="col-span-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              name="postalCode"
              placeholder={t.postalCode}
              value={form.postalCode}
              onChange={handleChange}
              required
              className="col-span-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Textarea
              name="additionalInfo"
              placeholder={t.additionalInfo}
              value={form.additionalInfo}
              onChange={handleChange}
              className="col-span-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Button
              type="submit"
              className="col-span-2 w-full bg-muted dark:bg-gray-700 text-foreground hover:bg-muted/70 dark:hover:bg-gray-600 font-semibold py-3 rounded-xl shadow-sm transition duration-300"
            >
              {t.submit}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
