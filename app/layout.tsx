import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google" // Import Playfair_Display
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/context/locale-context"
import { CartProvider } from "@/context/cart-context" 
import { ProductsProvider } from "@/context/ProductsContext"
import { ClerkProvider } from "@clerk/nextjs"


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" }) // Define as --font-sans
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif", // Define as --font-serif
  display: "swap",
})

export const metadata: Metadata = {
  title: "Elororojo.es",
  description: "Experience the golden touch of pure saffron.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0d9488", // teal‑600
          colorText: "#1f2937", // gray-900 for light mode, will be overridden by dark mode classes where applicable
          colorBackground: "#f3f4f6", // light gray for overall Clerk background
          fontFamily: inter.style.fontFamily, // Use Inter font for Clerk elements
          borderRadius: "0.5rem",
        },
        elements: {
          // The sign-in card
          card: "bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl border border-gray-100 dark:border-gray-700",
          headerTitle: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4",
          headerSubtitle: "text-gray-600 dark:text-gray-400 mb-6",
          // Labels (“Email address”), inputs, etc.
          formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium mb-1",
          formField:
            "w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100",
          formFieldInputPlaceholder: "text-gray-400 dark:text-gray-500", // Placeholder color
          // The “×” close button in the modal
          modalCloseButton: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
          // The primary submit button
          submitButton:
            "w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2", // Solid color, no shadow, accessibility focus
          // Social provider buttons container
          socialButtonsBlock: "flex flex-col gap-3 mt-4",
          // Each social button pill
          socialButton:
             "flex items-center justify-center gap-2 bg-white dark:bg-teal-400 border border-gray-200 dark:border-teal-300 hover:bg-gray-100 dark:hover:bg-teal-300 transition px-4 py-2 rounded-md shadow-sm",// Subtle shadow
          // Text for social buttons
          socialButtonText: "text-gray-700 dark:text-blue-400 font-medium", // Corrected text color for light mode
          // Keep icons a good size
          socialButtonIcon: "w-5 h-5",
          // Footer text and link (e.g., "Don't have an account? Sign up")
          footerActionText: "text-gray-600 dark:text-gray-400",
          footerActionLink: "text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium",
        },
      }}
    >

    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans`}>
      <ProductsProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <CartProvider>{children}</CartProvider>
          </LocaleProvider>
        </ThemeProvider>
      </ProductsProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
