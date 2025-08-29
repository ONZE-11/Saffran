"use client";

import { useEffect, useState } from "react";
import AdminOrdersTable from "@/components/ui/AdminOrdersTable";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [state, setState] = useState<"loading" | "ok" | "forbidden">("loading");
  const [locale, setLocale] = useState<"en" | "es">("en");

  useEffect(() => {
    // 🔍 Detect locale from browser
    const lang = navigator.language || "en";
    setLocale(lang.startsWith("es") ? "es" : "en");

    // 🔒 Check access via API
    fetch("/api/admin/me")
      .then((r) => {
        if (r.status === 200) setState("ok");
        else setState("forbidden");
      })
      .catch(() => setState("forbidden"));
  }, []);

  if (state === "loading")
    return (
      <>
        <SiteHeader />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p>🔄 {locale === "es" ? "Verificando acceso..." : "Checking access…"} </p>
        </main>
        <SiteFooter />
      </>
    );

  if (state === "forbidden")
    return (
      <>
        <SiteHeader />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 font-semibold">
          <p>⛔ {locale === "es" ? "Acceso denegado" : "403 – Access denied"}</p>
        </main>
        <SiteFooter />
      </>
    );

  return (
    <>
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          {locale === "es" ? "Panel de Administración" : "Admin Dashboard"}
        </h1>

        <div className="flex gap-4 mb-6">
          <Link href="/admin/comments">
            <Button
              variant="outline"
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-100 dark:text-indigo-200 dark:border-indigo-500 dark:hover:bg-indigo-800 transition-colors"
            >
              {locale === "es"
                ? "Ver mensajes de contacto"
                : "View Contact Messages"}
            </Button>
          </Link>
        </div>

        {/* ✅ جدول سفارشات */}
        <AdminOrdersTable />
      </main>
      <SiteFooter />
    </>
  );
}
