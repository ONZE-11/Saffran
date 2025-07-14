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
import { useUser, useAuth, SignIn } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { locale } = useLocale();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [showSignInModal, setShowSignInModal] = useState(false);

  // 🚫 اگر سبد خرید خالی بود → برگشت به محصولات
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/products");
    }
  }, [cartItems, router]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
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
      street: "Street Address",
      unitNumber: "Unit / Apartment Number",
      city: "City",
      postalCode: "Postal Code",
      additionalInfo: "Additional Info (optional)",
      submit: "Submit Order Request",
      signInToOrder: "Please sign in to submit your order.",
      orderSuccess: "🎉 Order placed successfully! Redirecting...",
      orderError: "❌ Something went wrong. Please try again.",
    },
    es: {
      title: "Información de Contacto y Envío",
      name: "Nombre Completo",
      phone: "Número de Teléfono",
      street: "Dirección",
      unitNumber: "Número de Unidad / Apartamento",
      city: "Ciudad",
      postalCode: "Código Postal",
      additionalInfo: "Información Adicional (opcional)",
      submit: "Enviar Solicitud de Pedido",
      signInToOrder: "Por favor, inicie sesión para enviar su pedido.",
      orderSuccess: "🎉 ¡Pedido enviado con éxito! Redirigiendo...",
      orderError: "❌ Algo salió mal. Por favor intente de nuevo.",
    },
  };

  const t = texts[locale ?? "en"];
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !user) {
      setShowSignInModal(true);
      return;
    }

    const fullAddress = `${form.street}, Unit ${form.unitNumber}, ${form.city}, ${form.postalCode}. ${form.additionalInfo}`;

    console.log("🛒 Submitting order:", {
      customer_name: form.name,
      customer_email: userEmail,
      customer_phone: form.phone,
      address: fullAddress,
      items: cartItems,
    });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: userEmail,
          customer_phone: form.phone,
          address: fullAddress,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Order saved successfully:", data.order_id);
        clearCart();

        // ✅ نمایش Toast موفقیت
        toast.success(t.orderSuccess, { duration: 2000 });

        // ⏳ کمی تأخیر قبل از ریدایرکت
        setTimeout(() => {
          router.push("/checkout/success");
        }, 2000);
      } else {
        console.error("❌ API error:", data.error);
        toast.error(t.orderError, { duration: 3000 });
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error(t.orderError, { duration: 3000 });
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
            />
            <Input
              name="phone"
              placeholder={t.phone}
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="street"
              placeholder={t.street}
              value={form.street}
              onChange={handleChange}
              required
            />
            <Input
              name="unitNumber"
              placeholder={t.unitNumber}
              value={form.unitNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder={t.city}
              value={form.city}
              onChange={handleChange}
              required
            />
            <Input
              name="postalCode"
              placeholder={t.postalCode}
              value={form.postalCode}
              onChange={handleChange}
              required
            />
            <Textarea
              name="additionalInfo"
              placeholder={t.additionalInfo}
              value={form.additionalInfo}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="col-span-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl shadow-sm transition duration-300"
            >
              {t.submit}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />

      {/* 🚨 Modal Clerk SignIn */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 relative">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <SignIn routing="hash" />
            <p className="mt-2 text-center text-sm text-gray-600">
              {t.signInToOrder}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
