import type { Metadata } from "next"
import { Bricolage_Grotesque, Figtree, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./_components/Navbar/Navbar"
import Providers from "./_components/Providers/Providers"
import { getUserCart } from "_/api/services/routeServices"
import { getUserWishlist } from "./wishlist/wishlist.actions"
import { Toaster } from "_/components/ui/sonner"

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
})

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "FreshCart",
    template: "%s | FreshCart",
  },
  description: "Fresh products delivered to your door.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Both return nothing when nobody is signed in, so guests pay no extra request.
  const [cart, wishlist] = await Promise.all([getUserCart(), getUserWishlist()])
  const cartCount = cart?.products?.reduce((n, item) => n + item.count, 0) ?? 0
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <Providers>
          <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />
          <main className="flex-1">{children}</main>

          <footer className="border-t bg-card/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
              <span className="font-heading font-semibold text-foreground">FreshCart</span>
              <span>© {new Date().getFullYear()} FreshCart. All rights reserved.</span>
            </div>
          </footer>

          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}