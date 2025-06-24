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

  // Define the address for the map (can be used for the iframe src)
  const mapAddress = "Avenida Francia, N45, Valencia, España";

  const handleEmailClick = () => {
    const email = "mairesmaster@outlook.com";
    const subject = "Consulta desde Elororojo.es";
    const body =
      "Hola, me gustaría obtener más información sobre sus productos de azafrán.";

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Try to open email client
    window.location.href = mailtoLink;
  };

  const copyEmailToClipboard = () => {
    const email = "mairesmaster@outlook.com";
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {" "}
      {/* Added gradient background */}
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          {/* Section 1: Page Title and Description */}
          <div
            className="text-center space-y-4 mb-16 animate-fade-in p-6 rounded-xl bg-gradient-to-br from-vibrant-orange-50 to-vibrant-pink-50 dark:from-card dark:to-card shadow-xl"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-serif text-foreground drop-shadow-lg">
              {t("contactPage.title")}
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed drop-shadow-sm">
              {t("contactPage.description")}
            </p>
          </div>
          {/* Section 2: Contact Info and Form - Arranged in a two-column grid */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Contact Information Card */}
            <Card
              className="p-8 shadow-2xl bg-gradient-to-br from-card to-muted/30 animate-fade-in border-2 border-vibrant-orange-200/30"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-0 space-y-8">
                <h2 className="text-3xl font-bold font-serif text-foreground flex items-center gap-4 mb-6 drop-shadow-md">
                  <MessageSquareTextIcon className="h-8 w-8 text-vibrant-orange-600 dark:text-vibrant-orange-400 flex-shrink-0 drop-shadow-sm" />
                  {t("contactPage.getInTouchTitle")}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-8">
                  {t("contactPage.getInTouchDescription")}
                </p>
                <div className="space-y-8">
                  <div className="flex items-start gap-4 text-foreground p-4 rounded-lg bg-gradient-to-r from-vibrant-orange-50 to-vibrant-pink-50 dark:from-muted/20 dark:to-muted/20 shadow-md">
                    <MailIcon className="h-6 w-6 text-vibrant-orange-600 dark:text-vibrant-orange-400 flex-shrink-0 mt-1 drop-shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg drop-shadow-sm">
                        {t("contactPage.email")}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={handleEmailClick}
                          className="text-muted-foreground hover:text-primary transition-colors text-base underline hover:scale-105 duration-200"
                        >
                          mairesmaster@outlook.com
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyEmailToClipboard}
                          className="h-6 w-6 p-0 hover:bg-muted shadow-sm hover:shadow-md transition-all duration-200"
                          title="Copiar email"
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                        {emailCopied && (
                          <span className="text-green-600 text-sm animate-pulse drop-shadow-sm">
                            ¡Copiado!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Haga clic para abrir su cliente de email o copiar la
                        dirección
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-foreground p-4 rounded-lg bg-gradient-to-r from-vibrant-blue-50 to-vibrant-purple-50 dark:from-muted/20 dark:to-muted/20 shadow-md">
                    <PhoneIcon className="h-6 w-6 text-vibrant-blue-600 dark:text-vibrant-blue-400 flex-shrink-0 mt-1 drop-shadow-sm" />
                    <div>
                      <h3 className="font-semibold text-lg drop-shadow-sm">
                        {t("contactPage.phone")}
                      </h3>
                      <a
                        href="tel:+34601080799"
                        className="text-muted-foreground hover:text-primary transition-colors text-base hover:scale-105 duration-200"
                      >
                        +34 601 080799
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-foreground p-4 rounded-lg bg-gradient-to-r from-vibrant-green-50 to-vibrant-yellow-50 dark:from-muted/20 dark:to-muted/20 shadow-md">
                    <MapPinIcon className="h-6 w-6 text-vibrant-green-600 dark:text-vibrant-green-400 flex-shrink-0 mt-1 drop-shadow-sm" />
                    <div>
                      <h3 className="font-semibold text-lg drop-shadow-sm">
                        {t("contactPage.address")}
                      </h3>
                      <p className="text-muted-foreground text-base">
                        Elororojo.es
                        <br />
                        Avenida Francia, N45
                        <br />
                        Valencia
                        <br />
                        España
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Order Inquiry Form Section */}
            <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <OrderMessageForm />
            </div>
          </div>
          {/* Section 3: Map */}
          <div
            className="max-w-5xl mx-auto w-full mt-16 animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <h2 className="text-3xl font-bold font-serif text-foreground text-center mb-8 flex items-center justify-center gap-4 drop-shadow-lg">
              <MapPinIcon className="h-8 w-8 text-vibrant-orange-600 dark:text-vibrant-orange-400 drop-shadow-sm" />
              {t("contactPage.findUsOnMap")}
            </h2>
            <div
              className="relative w-full rounded-xl overflow-hidden shadow-2xl border-4 border-white/20"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src="https://maps.google.com/maps?q=39.459761,-0.347374&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Elororojo.es - Avinguda de França, 45"
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
