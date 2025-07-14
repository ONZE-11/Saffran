import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/context/locale-context";
import { CartProvider } from "@/context/cart-context";
import { ProductsProvider } from "@/context/ProductsContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elororojo.es",
  description: "Experience the golden touch of pure saffron.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
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
