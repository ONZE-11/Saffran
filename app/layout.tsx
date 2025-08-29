import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/context/locale-context";
import { CartProvider } from "@/context/cart-context";
import { ProductsProvider } from "@/context/ProductsContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Script from "next/script"; // ✅ اینو اضافه کنید

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.elororojo.es"),
  title: {
    default: "Elororojo.es",
    template: "%s | Elororojo.es",
  },
  description: "Experience the golden touch of pure saffron.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <head>{/* ✅ اسکریپت Turnstile */}</head>
        <body
          className={`${inter.variable} ${playfairDisplay.variable} font-sans`}
        >
          <ProductsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LocaleProvider>
                <CartProvider>{children}</CartProvider>
              </LocaleProvider>
            </ThemeProvider>
          </ProductsProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
