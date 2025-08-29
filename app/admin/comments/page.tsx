"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

const MESSAGES_PER_PAGE = 5;

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function AdminCommentsPage() {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filtered, setFiltered] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "ok" | "forbidden" | "error">("loading");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact", { credentials: "include" });
        const data = await res.json();
        console.log("🔍 Contact API:", res.status, data);

        if (!res.ok) {
          setStatus("forbidden");
          return;
        }

        if (Array.isArray(data)) {
          setMessages(data);
          setFiltered(data);
          setStatus("ok");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setStatus("error");
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    let result = messages;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (msg) =>
          msg.name.toLowerCase().includes(q) ||
          msg.email.toLowerCase().includes(q)
      );
    }
    if (startDate || endDate) {
      result = result.filter((msg) => {
        const msgDate = new Date(msg.created_at);
        return (!startDate || msgDate >= startDate) && (!endDate || msgDate <= endDate);
      });
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [search, startDate, endDate, messages]);

  const deleteMessage = async (id: number) => {
    if (
      !confirm(locale === "es" ? "¿Seguro que quieres eliminar este mensaje?" : "Are you sure?")
    )
      return;

    const res = await fetch(`/api/contact/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id));
    else alert(locale === "es" ? "❌ No se pudo eliminar" : "❌ Delete failed");
  };

  const totalPages = Math.ceil(filtered.length / MESSAGES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * MESSAGES_PER_PAGE,
    currentPage * MESSAGES_PER_PAGE
  );

  // ✅ Status Handling
  if (status === "loading")
    return (
      <>
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center">
          {locale === "es" ? "Verificando acceso..." : "Checking access..."}
        </main>
        <SiteFooter />
      </>
    );

  if (status === "forbidden")
    return (
      <>
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center text-red-600">
          {locale === "es" ? "⛔ Acceso denegado" : "⛔ Access denied"}
        </main>
        <SiteFooter />
      </>
    );

  if (status === "error")
    return (
      <>
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center text-red-500">
          {locale === "es" ? "❌ Error al cargar mensajes" : "❌ Failed to load messages"}
        </main>
        <SiteFooter />
      </>
    );

  // ✅ Messages
  return (
    <>
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          {locale === "es" ? "📩 Gestión de Mensajes" : "📩 Contact Messages"}
        </h1>

        {paginated.length === 0 ? (
          <p className="text-muted-foreground">
            {locale === "es" ? "No hay mensajes." : "No messages found."}
          </p>
        ) : (
          <div className="space-y-6">
            {paginated.map((msg) => (
              <div key={msg.id} className="rounded-xl p-5 border shadow bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-lg">{msg.name}</p>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                  <p className="text-xs">{formatDateTime(msg.created_at)}</p>
                </div>
                {msg.subject && (
                  <p className="text-sm font-medium text-orange-600 mb-1">
                    {locale === "es" ? "Asunto:" : "Subject:"} {msg.subject}
                  </p>
                )}
                <p className="text-sm">{msg.message}</p>
                <div className="text-right mt-2">
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    {locale === "es" ? "Eliminar" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
