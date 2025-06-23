// app/admin/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminOrdersTable from "@/components/ui/AdminOrdersTable";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Locale } from "@/lib/translations";

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const adminEmail = "mahjoubia509@gmail.com";
  const email = user.emailAddresses[0].emailAddress;
  if (email !== adminEmail) redirect("/");

  // 🔍 تشخیص زبان از هدر مرورگر (Accept-Language)
  const acceptLanguage = (await headers()).get("accept-language") ?? "en";
  const detectedLocale = acceptLanguage.startsWith("es") ? "es" : "en";

  return (
    <>
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          {detectedLocale === "es" ? "Panel de Administración" : "Admin Dashboard"}
        </h1>

        {/* ✅ زبان به جدول پاس داده می‌شود */}
        <AdminOrdersTable locale={detectedLocale as Locale} />
      </main>
      <SiteFooter />
    </>
  );
}
