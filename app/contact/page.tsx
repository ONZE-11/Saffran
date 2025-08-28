"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import OrderMessageForm from "@/components/order-message-form";
import { useLocale } from "@/context/locale-context";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  CopyIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useLocale();
  const [emailCopied, setEmailCopied] = useState(false);

  const email = "mairesmaster@gmail.com";

  const handleEmailClick = () => {
    const subject = t("contactPage.emailSubject") || "Consulta desde Elororojo.es";
    const body =
      t("contactPage.emailBody") ||
      "Hola, me gustaría obtener más información sobre sus productos de azafrán.";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          {/* Title & Description */}
          <div className="text-center space-y-4 mb-16 p-6 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-card dark:to-card shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-serif text-foreground">
              {t("contactPage.title")}
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto"></div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              {t("contactPage.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Contact Info */}
            <Card className="p-8 shadow-2xl bg-gradient-to-br from-card to-muted/30 border-2 border-orange-200/30">
              <CardContent className="p-0 space-y-8">
                <h2 className="text-3xl font-bold font-serif flex items-center gap-4">
                  <MessageSquareTextIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  {t("contactPage.getInTouchTitle")}
                </h2>
                <p className="text-muted-foreground">{t("contactPage.getInTouchDescription")}</p>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 dark:from-muted/20 dark:to-muted/20">
                  <MailIcon className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{t("contactPage.email")}</h3>
                    <div className="flex items-center gap-2 mt-1 font-mono text-indigo-700 dark:text-indigo-300">
                      <button onClick={handleEmailClick} className="underline hover:text-primary">
                        {email}
                      </button>
                      <Button variant="ghost" size="sm" onClick={copyEmailToClipboard} className="h-6 w-6 p-0">
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                      {emailCopied && <span className="text-green-600 text-sm">{t("contactPage.emailCopied")}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t("contactPage.emailHelp")}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-muted/20 dark:to-muted/20">
                  <PhoneIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{t("contactPage.phone")}</h3>
                    <a href="tel:+34601080799" className="text-[15px] font-medium text-blue-700 dark:text-blue-300 hover:underline">
                      +34 601 080799
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-yellow-50 dark:from-muted/20 dark:to-muted/20">
                  <MapPinIcon className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{t("contactPage.address")}</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {t("contactPage.addressLine1")} <br />
                      {t("contactPage.addressLine2")} <br />
                      {t("contactPage.addressLine3")} <br />
                      {t("contactPage.addressLine4")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="p-8 shadow-2xl bg-gradient-to-br from-card to-muted/30 border-2 border-orange-200/30">
              <CardContent className="p-0">
                <OrderMessageForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
