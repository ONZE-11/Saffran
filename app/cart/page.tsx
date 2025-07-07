"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/context/cart-context"
import { useLocale } from "@/context/locale-context"
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <SiteHeader />
        <main className="flex-1 py-12 md:py-20 animate-fade-in">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <div className="space-y-6 p-8 rounded-xl bg-gradient-to-br from-card to-muted/30 shadow-xl">
              <ShoppingBagIcon className="h-24 w-24 text-muted-foreground mx-auto opacity-50" />
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">{t("common.cartIsEmpty")}</h1>
              <p className="text-muted-foreground text-lg">
                Descubre nuestros productos de azafrán premium y añade algunos a tu carrito.
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-vibrant-orange-600 to-vibrant-pink-600 hover:from-vibrant-orange-700 hover:to-vibrant-pink-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {t("common.continueShopping")}
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20 animate-fade-in">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-foreground">
              {t("common.yourCart")} ({cartItemCount} {cartItemCount === 1 ? "artículo" : "artículos"})
            </h1>
            <p className="text-muted-foreground">Revisa tus productos seleccionados antes de proceder.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name[locale]}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Link href={`/products/${item.slug}`} className="block">
                          <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                            {item.name[locale]}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-vibrant-orange-700 dark:text-vibrant-orange-400">
                          €{Number(item.price ?? 0).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            {t("common.remove")}
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-foreground">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">{t("common.subtotal")}:</span>
                    <span className="font-bold text-foreground">€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Envío:</span>
                    <span>Calculado en el checkout</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-foreground">{t("common.total")}:</span>
                    <span className="text-vibrant-orange-700 dark:text-vibrant-orange-400">
                      €{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Link href="/checkout" className="w-full block">
                      <Button className="w-full bg-gradient-to-r from-vibrant-orange-600 to-vibrant-pink-600 hover:from-vibrant-orange-700 hover:to-vibrant-pink-700 text-white py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        {t("common.inquireToOrder")}
                      </Button>
                    </Link>
                    <Link href="/products" className="w-full block">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {t("common.continueShopping")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
