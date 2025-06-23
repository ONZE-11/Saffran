"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLocale } from "@/context/locale-context"
import { LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"

type FormStatus = "idle" | "loading" | "success" | "error"

export default function OrderMessageForm() {
  const { t } = useLocale()
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [responseMessage, setResponseMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)  // رفرنس فرم

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus("loading")

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      let result: any = {}
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error("خطا در تبدیل پاسخ به JSON:", jsonError)
      }

      if (response.ok) {
        setFormStatus("success")
        setResponseMessage(result?.message || "پیام با موفقیت ارسال شد.")
        if (formRef.current) formRef.current.reset()  // استفاده از رفرنس فرم برای ریست کردن
      } else {
        setFormStatus("error")
        setResponseMessage(result?.error || "ارسال پیام با خطا مواجه شد.")
      }
    } catch (error) {
      console.error("خطای اتصال:", error)
      setFormStatus("error")
      setResponseMessage("خطای اتصال. لطفا دوباره تلاش کنید.")
    }

    setTimeout(() => {
      setFormStatus("idle")
      setResponseMessage("")
    }, 5000)
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-card to-muted/30 shadow-xl border-2 border-vibrant-orange-200/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-serif text-foreground drop-shadow-sm">
          {t("contactPage.formTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{t("contactPage.formDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("common.yourName")}</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t("common.emailAddress")}</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">{t("common.subjectOptional")}</Label>
            <Input id="subject" name="subject" type="text" placeholder="Product inquiry..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">{t("common.yourMessage")}</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              rows={5}
              required
            />
          </div>

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
  )
}
