"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SunIcon,
  MoonIcon,
  GlobeIcon,
  ShoppingCartIcon,
  MenuIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/context/locale-context";
import { useCart } from "@/context/cart-context";
import { Logo } from "@/components/logo";
import { SignInButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export function SiteHeader() {
  const { setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const { cartItemCount } = useCart();
  
  const { user } = useUser();
  const adminEmails = ["mahjoubia509@gmail.com", "mairesmaster@outlook.com"];
  const isAdmin = adminEmails.includes(
  user?.emailAddresses?.[0]?.emailAddress || ""
);


  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="font-medium text-foreground/70 hover:text-primary transition-colors"
            prefetch={false}
          >
            {t("common.home")}
          </Link>
          <Link
            href="/products"
            className="font-medium text-foreground/70 hover:text-primary transition-colors"
            prefetch={false}
          >
            {t("common.shopSaffron")}
          </Link>
          <Link
            href="/about"
            className="font-medium text-foreground/70 hover:text-primary transition-colors"
            prefetch={false}
          >
            {t("common.aboutUs")}
          </Link>
          <Link
            href="/contact"
            className="font-medium text-foreground/70 hover:text-primary transition-colors"
            prefetch={false}
          >
            {t("common.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* ✅ Admin Panel Button (visible only to admin) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm shadow transition"
            >
              🛠 Admin Panel
            </Link>
          )}

          {/* 🛒 Shopping Cart */}
          <Link href="/cart" className="relative group" prefetch={false}>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/70 hover:bg-muted hover:opacity-80 transition-all duration-200 relative"
            >
              <ShoppingCartIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t("common.viewCart")}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md ring-2 ring-white dark:ring-background">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {cartItemCount > 0
                ? `${cartItemCount} ${cartItemCount === 1 ? "artículo" : "artículos"}`
                : "Carrito vacío"}
            </div>
          </Link>

          {/* 🌐 Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:bg-muted hover:opacity-80 transition-all duration-200"
              >
                <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Select language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocale("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("es")}>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 🌓 Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:bg-muted hover:opacity-80 transition-all duration-200"
              >
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t("common.toggleTheme")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {t("common.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {t("common.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {t("common.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ☰ Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/70 hover:text-primary"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>

          {/* 👤 Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
