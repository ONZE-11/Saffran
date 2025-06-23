"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { translations, type Locale } from "@/lib/translations"

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string // Simplified translation function
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es") // Default to Spanish

  const setLocale = useCallback((newLocale: Locale) => {
    if (Object.keys(translations).includes(newLocale)) {
      setLocaleState(newLocale)
    } else {
      console.warn(`Locale "${newLocale}" not supported. Defaulting to "en".`)
      setLocaleState("en")
    }
  }, [])

  // Simple translation function to access nested keys
  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      let current: any = translations[locale]
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k]
        } else {
          console.warn(`Translation key "${key}" not found for locale "${locale}".`)
          return key // Return the key itself if not found
        }
      }
      return typeof current === "string" ? current : key
    },
    [locale],
  )

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
