"use client"

import type React from "react"

import Link from "next/link"
import { useLocale } from "@/context/locale-context"
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  PinIcon as PinterestIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react"
import { Logo } from "./logo" // Import the Logo component
import { useState } from "react"

export function SiteFooter() {
  const { t } = useLocale()
  const [emailCopied, setEmailCopied] = useState(false)

  const handleEmailClick = (e: React.MouseEvent) => {
    // Try to open email client
    const email = "mairesmaster@outlook.com"
    const subject = "Consulta desde Elororojo"
    const body = "Hola, me gustaría obtener más información sobre sus productos de azafrán."

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Try to open email client
    window.location.href = mailtoLink

    // Also copy email to clipboard as fallback
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 2000)
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = email
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 2000)
      })
  }

  return (
    <footer className="bg-gradient-to-br from-card via-card to-muted/30 p-4 md:py-8 w-full border-t border-border/40 text-xs shadow-2xl">
      {" "}
      {/* Added gradient background and shadow */}
      <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4">
        {" "}
        {/* Reduced gaps further */}
        {/* Brand / About Section */}
        <div className="lg:col-span-2 flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-vibrant-orange-50 to-vibrant-pink-50 dark:from-card dark:to-card shadow-lg">
          {" "}
          {/* Added gradient background and shadow */}
          <Logo />
          <p className="text-muted-foreground max-w-xs leading-relaxed text-xs">
            {" "}
            {/* Ensured text-xs */}
            {t("homepage.heroDescription").split(".")[0]}. {t("common.allRightsReserved")}
          </p>
          <div className="flex space-x-3 mt-1">
            {" "}
            {/* Reduced space-x */}
            <Link href="https://www.facebook.com/profile.php?id=61578322670821" target="_blank" prefetch={false} aria-label="Facebook">
              <FacebookIcon className="h-4 w-4 text-muted-foreground hover:bg-muted hover:opacity-80 transition-all duration-200 p-0.5 rounded" />{" "}
              {/* Neutral hover */}
            </Link>
            <Link href="https://www.instagram.com/elororojoazafran?igsh=MWhvaDgxN3Zqc2wwbQ%3D%3D&utm_source=qr"target="_blank" prefetch={false} aria-label="Instagram">

              <InstagramIcon className="h-4 w-4 text-muted-foreground hover:bg-muted hover:opacity-80 transition-all duration-200 p-0.5 rounded" />
            </Link>
            <Link href="#" prefetch={false} aria-label="Twitter">
              <TwitterIcon className="h-4 w-4 text-muted-foreground hover:bg-muted hover:opacity-80 transition-all duration-200 p-0.5 rounded" />
            </Link>
            <Link href="#" prefetch={false} aria-label="Pinterest">
              <PinterestIcon className="h-4 w-4 text-muted-foreground hover:bg-muted hover:opacity-80 transition-all duration-200 p-0.5 rounded" />
            </Link>
          </div>
        </div>
        {/* Company Links */}
        <div className="grid gap-2 p-3 rounded-lg bg-gradient-to-br from-vibrant-blue-50 to-vibrant-purple-50 dark:from-card dark:to-card shadow-md">
          {" "}
          {/* Added gradient background and shadow */}
          <h3 className="font-semibold text-foreground text-sm drop-shadow-sm">{t("common.company")}</h3>{" "}
          {/* Added drop-shadow */}
          <Link
            href="/about"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.aboutUs")}
          </Link>
          <Link
            href="/products"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.shopSaffron")}
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.blog")}
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.careers")}
          </Link>
        </div>
        {/* Products Links */}
        <div className="grid gap-2 p-3 rounded-lg bg-gradient-to-br from-vibrant-green-50 to-vibrant-yellow-50 dark:from-card dark:to-card shadow-md">
          {" "}
          {/* Added gradient background and shadow */}
          <h3 className="font-semibold text-foreground text-sm drop-shadow-sm">{t("common.products")}</h3>{" "}
          {/* Added drop-shadow */}
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            Premium Saffron
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            Saffron Threads
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            Saffron Powder
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            Gift Sets
          </Link>
        </div>
        {/* Support & Contact Info */}
        <div className="grid gap-2 p-3 rounded-lg bg-gradient-to-br from-vibrant-purple-50 to-vibrant-pink-50 dark:from-card dark:to-card shadow-md">
          {" "}
          {/* Added gradient background and shadow */}
          <h3 className="font-semibold text-foreground text-sm drop-shadow-sm">{t("common.support")}</h3>{" "}
          {/* Added drop-shadow */}
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.contact")}
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.faq")}
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.shippingReturns")}
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
            prefetch={false}
          >
            {t("common.privacyPolicy")}
          </Link>
          <div className="space-y-1 mt-2">
            {" "}
            {/* Reduced space-y and mt */}
            <div className="flex items-center gap-1 text-muted-foreground">
              {" "}
              {/* Reduced gap */}
              <MailIcon className="h-3 w-3 text-primary dark:text-vibrant-orange-400" /> {/* Added dark mode color */}
              <button
                onClick={handleEmailClick}
                className="hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 cursor-pointer text-left p-1 rounded"
                title="Haga clic para enviar email o copiar dirección"
              >
                mairesmaster@gmail.com
              </button>
              {emailCopied && <span className="text-green-600 text-xs ml-1 animate-pulse">¡Copiado!</span>}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              {" "}
              {/* Reduced gap */}
              <PhoneIcon className="h-3 w-3 text-primary dark:text-vibrant-orange-400" /> {/* Added dark mode color */}
              <a
                href="tel:+34601080799"
                className="hover:text-primary dark:hover:text-vibrant-orange-400 transition-colors duration-200 p-1 rounded"
              >
                +34 601 080799
              </a>
            </div>
            <div className="flex items-start gap-1 text-muted-foreground">
              {" "}
              {/* Reduced gap */}
              <MapPinIcon className="h-3 w-3 text-primary dark:text-vibrant-orange-400 mt-0.5" />{" "}
              {/* Added dark mode color */}
              <span>Avenida Francia, N45, Valencia, España</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl text-center text-muted-foreground mt-6 pt-4 border-t border-border/40">
        {" "}
        {/* Reduced mt and pt */}
        <p className="text-xs drop-shadow-sm">
          {" "}
          {/* Added drop-shadow */}
          &copy; {new Date().getFullYear()} Elororojo.es. {t("common.allRightsReserved")}
        </p>
      </div>
    </footer>
  )
}
