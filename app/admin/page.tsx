"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default function AdminCommentsPage() {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();

        if (!res.ok) {
          setAuthorized(false);
          setError(data?.error || "Unknown error");
          return;
        }

        if (Array.isArray(data)) {
          setMessages(data);
          setAuthorized(true);
        } else {
          // اگر به‌جای آرایه یک object اومده
          setAuthorized(false);
          setError("Invalid response format");
        }
      } catch (err) {
        setAuthorized(false);
        setError("Network error");
      }
    };

    fetchMessages();
  }, []);

  if (authorized === null) {
    return (
      <>
        <SiteHeader />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p>{locale === "es" ? "Verificando acceso..." : "Checking access..."}</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (authorized === false) {
    return (
      <>
        <SiteHeader />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600">
          <p>⛔ {locale === "es" ? "Acceso denegado" : "403 – Access denied"}</p>
          {error && <p className="mt-2 text-sm text-gray-500">{error}</p>}
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">
          {locale === "es" ? "Mensajes de contacto" : "Contact Messages"}
        </h1>

        {messages.length === 0 ? (
          <p>{locale === "es" ? "No hay mensajes." : "No messages yet."}</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="font-semibold">{msg.name}</p>
                <p className="text-sm text-gray-500">{msg.email}</p>
                {msg.subject && (
                  <p className="text-sm mt-1">
                    <strong>{locale === "es" ? "Asunto:" : "Subject:"}</strong>{" "}
                    {typeof msg.subject === "string" ? msg.subject : ""}
                  </p>
                )}
                <p className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                  {typeof msg.message === "string" ? msg.message : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
