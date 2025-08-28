"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import Turnstile from "react-turnstile"; // ✅ استفاده از پکیج آماده

type FormStatus = "idle" | "loading" | "success" | "error";

export default function OrderMessageForm() {
  const { t } = useLocale();
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // ✅ ذخیره توکن کپچا
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current) return;

    // ✅ باید کپچا پر شده باشه
    if (!captchaToken) {
      setFormStatus("error");
      setResponseMessage("⚠️ Please verify captcha first.");
      return;
    }

    setFormStatus("loading");
    setResponseMessage("");

    const formData = new FormData(formRef.current);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      "cf-turnstile-response": captchaToken, // 👈 ارسال توکن به API
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setResponseMessage(result?.message || t("contactForm.successMessage"));
        formRef.current.reset();
        setCaptchaToken(null); // reset captcha
      } else {
        setFormStatus("error");
        setResponseMessage(result?.error || t("contactForm.errorMessage"));
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setFormStatus("error");
      setResponseMessage(t("contactForm.networkError"));
    }

    setTimeout(() => {
      setFormStatus("idle");
      setResponseMessage("");
    }, 5000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-card to-muted/30 shadow-xl border-2 border-orange-200/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-serif text-foreground drop-shadow-sm">
          {t("contactPage.formTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("contactPage.formDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("common.yourName")}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t("common.yourEmail")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">{t("common.subjectOptional")}</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder={t("contactForm.subjectPlaceholder")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">{t("common.yourMessage")}</Label>
            <Textarea
              id="message"
              name="message"
              placeholder={t("contactForm.messagePlaceholder")}
              rows={5}
              required
            />
          </div>

          {/* ✅ Turnstile widget */}
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={(token) => setCaptchaToken(token)}
            theme="light" // ✅ مستقیم استفاده کن
            size="normal" // (اختیاری: normal, compact, invisible)
            retry="auto" // (اختیاری: auto, never)
            refreshExpired="auto" // (اختیاری)
          />

          {responseMessage && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                formStatus === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {formStatus === "success" ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : (
                <AlertCircleIcon className="h-4 w-4" />
              )}
              <span>{responseMessage}</span>
            </div>
          )}

          <Button type="submit" disabled={formStatus === "loading"}>
            {formStatus === "loading" ? (
              <div className="flex items-center gap-2">
                <LoaderIcon className="h-4 w-4 animate-spin" />
                <span>{t("common.sending")}...</span>
              </div>
            ) : (
              t("common.sendMessage")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        {formStatus === "idle" && t("common.weWillContactYouShortly")}
      </CardFooter>
    </Card>
  );
}
