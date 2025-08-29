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

// ✅ Helper برای تاریخ اسپانیا
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const [day, month, year] = date
    .toLocaleDateString("es-ES", optionsDate)
    .split("/");

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = date.toLocaleTimeString("es-ES", optionsTime);

  return `${formattedDate}, ${formattedTime}`;
};

export default function AdminCommentsPage() {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filtered, setFiltered] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/contact");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/";
        return;
      }
      if (!res.ok) {
        setAuthorized(false);
        return;
      }
      const data: Message[] = await res.json();
      setMessages(data);
      setFiltered(data);
      setAuthorized(true);
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
        const afterStart = startDate ? msgDate >= startDate : true;
        const beforeEnd = endDate ? msgDate <= endDate : true;
        return afterStart && beforeEnd;
      });
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [search, startDate, endDate, messages]);

  const deleteMessage = async (id: number) => {
    if (
      !confirm(
        locale === "es"
          ? "¿Seguro que quieres eliminar este mensaje?"
          : "Are you sure you want to delete this message?"
      )
    ) {
      return;
    }
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert(locale === "es" ? "❌ No se pudo eliminar" : "❌ Delete failed");
    }
  };

  const totalPages = Math.ceil(filtered.length / MESSAGES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * MESSAGES_PER_PAGE,
    currentPage * MESSAGES_PER_PAGE
  );

  const getPageNumbers = (
    current: number,
    total: number
  ): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 1;
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (authorized === null) {
    return (
      <>
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 py-20 text-center text-muted-foreground">
          {locale === "es" ? "Verificando acceso..." : "Verifying access..."}
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          {locale === "es"
            ? "📩 Gestión de Mensajes de Contacto"
            : "📩 Contact Message Management"}
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === "es"
                ? "Buscar por nombre o email..."
                : "Search by name or email..."
            }
            className="px-3 py-2 border rounded shadow-sm text-sm"
          />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText={locale === "es" ? "Desde" : "From"}
            className="px-3 py-2 border rounded shadow-sm text-sm"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText={locale === "es" ? "Hasta" : "To"}
            className="px-3 py-2 border rounded shadow-sm text-sm"
          />
        </div>

        {paginated.length === 0 ? (
          <p className="text-muted-foreground">
            {locale === "es" ? "No hay mensajes." : "No messages found."}
          </p>
        ) : (
          <div className="space-y-6">
            {paginated.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">
                      {msg.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(msg.created_at)}
                  </p>
                </div>
                {msg.subject && (
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-300 mb-2">
                    {locale === "es" ? "Asunto" : "Subject"}: {msg.subject}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {msg.message}
                </p>
                <div className="text-right mt-4">
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    {locale === "es" ? "Eliminar" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginated.length > 0 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {currentPage > 1 && (
              <button
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-1 rounded border bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {locale === "es" ? "Anterior" : "Prev"}
              </button>
            )}
            {getPageNumbers(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page as number);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-3 py-1 rounded font-medium border transition-colors duration-200 ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-1 rounded border bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {locale === "es" ? "Siguiente" : "Next"}
              </button>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
