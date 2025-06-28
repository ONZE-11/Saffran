"use client"

import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLocale } from "@/context/locale-context"
import { SproutIcon, GemIcon } from "lucide-react" // Added icons for About Us


export default function AboutPage() {
  const { t } = useLocale()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-foreground">
              {t("aboutPage.title")}
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">{t("aboutPage.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16 p-6 rounded-lg bg-card shadow-lg">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground flex items-center gap-3">
                <SproutIcon className="h-8 w-8 text-vibrant-orange-600 dark:text-vibrant-orange-400" />
                {t("aboutPage.fromFieldToTableTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.fromFieldToTableDescription1")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.fromFieldToTableDescription2")}</p>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/saffron-harvest-field.png"
                alt="Saffron field with blooming crocus flowers at sunset"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center flex-row-reverse p-6 rounded-lg bg-card shadow-lg">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground flex items-center gap-3">
                <GemIcon className="h-8 w-8 text-vibrant-orange-600 dark:text-vibrant-orange-400" />
                {t("aboutPage.purityQualityTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.purityQualityDescription1")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.purityQualityDescription2")}</p>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/saffron-gift-set.png"
                alt="Macro shot of vibrant red saffron threads"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="mt-16 p-6 rounded-lg bg-card shadow-lg">
  <div className="text-center space-y-4 mb-8">
    <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">
      {t("aboutPage.whyChooseUsTitle")}
    </h2>
    <p className="text-muted-foreground max-w-2xl mx-auto">
      {t("aboutPage.whyChooseUsDescription")}
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6 text-center">
    <div className="bg-muted dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t("aboutPage.why1Title")}
      </h3>
      <p className="text-muted-foreground">{t("aboutPage.why1Desc")}</p>
    </div>
    <div className="bg-muted dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t("aboutPage.why2Title")}
      </h3>
      <p className="text-muted-foreground">{t("aboutPage.why2Desc")}</p>
    </div>
    <div className="bg-muted dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t("aboutPage.why3Title")}
      </h3>
      <p className="text-muted-foreground">{t("aboutPage.why3Desc")}</p>
    </div>
  </div>
</div>

      </main>
       
      <SiteFooter />
    </div>
  )
}
