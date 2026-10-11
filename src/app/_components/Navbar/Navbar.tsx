"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Heart, Leaf, Menu, ShoppingBag } from "lucide-react"

import { cn } from "_/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "_/components/ui/sheet"
import LogoutButton from "./LogoutButton"
import SearchBox from "../SearchBox/SearchBox"
import UserMenu from "../UserMenu/UserMenu"
import ThemeToggle from "../ThemeToggle/ThemeToggle"

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
]

function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground transition-transform duration-500 group-hover:rotate-12">
        <Leaf className="size-4" />
      </span>
      FreshCart
    </Link>
  )
}

function CountBadge({ count }: { count: number }) {
  if (!count) return null
  return (
    <span
      key={count}
      className="animate-bump absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground ring-2 ring-background"
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}

type Props = {
  cartCount?: number
  wishlistCount?: number
}

export default function Navbar({ cartCount = 0, wishlistCount = 0 }: Props) {
  const { status } = useSession()
  const pathname = usePathname()
  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const iconLink =
    "relative grid size-10 place-items-center rounded-full text-foreground/70 transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-90"

  const mobileLinks = [
    ...links,
    ...(isAuthenticated
      ? [
          { href: "/orders", label: "My orders" },
          { href: "/wishlist", label: "Wishlist", count: wishlistCount },
          { href: "/cart", label: "Cart", count: cartCount },
          { href: "/profile", label: "Profile" },
        ]
      : []),
  ] as { href: string; label: string; count?: number }[]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[padding] duration-300 sm:px-6",
          scrolled ? "py-2.5" : "py-4"
        )}
      >
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100",
                isActive(link.href) && "text-foreground after:scale-x-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchBox className="hidden lg:block" inputClassName="w-48 focus:w-72 xl:w-60" />

        {/* Desktop actions */}
        <div className="hidden min-w-[120px] items-center justify-end gap-1 md:flex">
          <ThemeToggle />
          {isLoading ? null : !isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand/90 hover:shadow-md hover:shadow-brand/25 active:scale-95"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link href="/wishlist" aria-label="Wishlist" className={iconLink}>
                <Heart size={20} />
                <CountBadge count={wishlistCount} />
              </Link>
              <Link href="/cart" aria-label="Cart" className={iconLink}>
                <ShoppingBag size={20} />
                <CountBadge count={cartCount} />
              </Link>
              <UserMenu />
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          {isAuthenticated && (
            <Link href="/cart" aria-label="Cart" className={iconLink}>
              <ShoppingBag size={20} />
              <CountBadge count={cartCount} />
            </Link>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
              >
                <Menu />
              </button>
            </SheetTrigger>

            <SheetContent className="flex flex-col gap-1 overflow-y-auto p-6">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate through FreshCart sections
                </SheetDescription>
              </SheetHeader>

              <SearchBox
                className="mb-3 mt-6"
                inputClassName="h-12"
                onSubmitted={() => setOpen(false)}
              />

              {mobileLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "fade-up flex items-center justify-between rounded-xl px-3 py-3 font-heading text-xl font-semibold transition-colors hover:bg-secondary",
                    isActive(link.href) && "text-brand"
                  )}
                  style={{ "--d": `${i * 45}ms` } as React.CSSProperties}
                >
                  {link.label}
                  {link.count ? (
                    <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-brand-foreground">
                      {link.count}
                    </span>
                  ) : null}
                </Link>
              ))}

              <div
                className="fade-up mt-4 flex flex-col gap-3 border-t pt-6"
                style={{ "--d": "350ms" } as React.CSSProperties}
              >
                {isLoading ? null : !isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-full border px-4 py-3 text-center text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-foreground"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <LogoutButton />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}