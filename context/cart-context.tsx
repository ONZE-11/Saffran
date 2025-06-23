"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import { useProducts } from "@/context/ProductsContext" // ← اطمینان حاصل کن مسیر درست باشد

export type CartItem = {
  id: string
  quantity: number
  price: number
  name: { en: string; es: string }
  image: string
  slug: string
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartItemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const products = useProducts()

  useEffect(() => {
    const storedCart = localStorage.getItem("saffron_cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("saffron_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === productId)
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          const product = products.find((p) => p.id.toString() === productId)

          if (!product) {
            console.warn("Product not found in products context")
            return prevItems // می‌تونی به‌جای این نوتیفیکیشن یا ارور UI هم بدهی
          }

          return [
            ...prevItems,
            {
              id: product.id.toString(),
              quantity,
              price: product.price,
              name: { en: product.title_en, es: product.title_es },
              image: product.image_url,
              slug: product.slug,
            },
          ]
        }
      })
    },
    [products]
  )

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    )
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId)
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
