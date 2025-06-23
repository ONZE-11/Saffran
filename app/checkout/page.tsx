"use client"

import { useState } from "react"
import { useLocale } from "@/context/locale-context"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"



export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { locale } = useLocale()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  const texts = {
    en: {
      title: "Contact Information",
      name: "Full Name",
      phone: "Phone Number",
      email: "Email (optional)",
      address: "Shipping Address",
      submit: "Submit Order Request",
      success: "Your order request was received. We will contact you shortly.",
    },
    es: {
      title: "Información de Contacto",
      name: "Nombre Completo",
      phone: "Número de Teléfono",
      email: "Correo Electrónico (opcional)",
      address: "Dirección de Envío",
      submit: "Enviar Solicitud de Pedido",
      success: "Su solicitud de pedido ha sido recibida. Nos pondremos en contacto con usted pronto.",
    },
  }

  const t = texts[locale ?? "en"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        address: form.address,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(t.success);
      clearCart();
      router.push("/products");
    } else {
      console.error("Order failed", data.error);
      alert("❌ خطا در ثبت سفارش");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("❌ خطای غیرمنتظره هنگام ثبت سفارش");
  }
};


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-xl mx-auto px-4 space-y-6">
          <h1 className="text-3xl font-bold text-center">{t.title}</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl shadow-xl">
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
              name="email"
              type="email"
              placeholder={t.email}
              value={form.email}
              onChange={handleChange}
            />
            <Textarea
              name="address"
              placeholder={t.address}
              value={form.address}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white">
              {t.submit}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
