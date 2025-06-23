"use client"
import Link from "next/link"
import { LeafIcon } from "lucide-react" // Changed icon to LeafIcon for olive theme
import { useLocale } from "@/context/locale-context"

export function Logo() {
  const { t } = useLocale()

  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-serif text-2xl font-bold text-vibrant-orange-800 dark:text-vibrant-orange-200 hover:text-vibrant-orange-900 dark:hover:text-vibrant-orange-100 transition-colors drop-shadow-md" // Added drop-shadow
      prefetch={false}
    >
      <LeafIcon className="h-7 w-7 text-vibrant-orange-600 dark:text-vibrant-orange-400 drop-shadow-sm" />{" "}
      {/* Added drop-shadow */}
      <span>
        Elororojo<span className="text-muted-foreground text-lg">.es</span>
      </span>
    </Link>
  )
}
