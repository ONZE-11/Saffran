import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminOrdersTable from "@/components/ui/AdminOrdersTable";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Locale } from "@/lib/translations";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const email = user.emailAddresses[0].emailAddress;

  // ✅ ایمیل‌های مجاز برای ورود به پنل ادمین
 const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) ?? [];

 console.log("🔍 Current user:", email);
console.log("🔍 Admin emails:", adminEmails);

if (!adminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
  redirect("/");
}



  // 🔍 تشخیص زبان از هدر مرورگر (Accept-Language)
  const acceptLanguage = (await headers()).get("accept-language") ?? "en";
  const detectedLocale = acceptLanguage.startsWith("es") ? "es" : "en";

  return (
    <>
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          {detectedLocale === "es"
            ? "Panel de Administración"
            : "Admin Dashboard"}
        </h1>
        <div className="flex gap-4 mb-6">
          <Link href="/admin/comments">
            <Button
              variant="outline"
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-100 dark:text-indigo-200 dark:border-indigo-500 dark:hover:bg-indigo-800 transition-colors"
            >
              {detectedLocale === "es"
                ? "Ver mensajes de contacto"
                : "View Contact Messages"}
            </Button>
          </Link>
        </div>

        {/* ✅ زبان به جدول پاس داده می‌شود */}
        <AdminOrdersTable />
      </main>
      <SiteFooter />
    </>
  );
}
