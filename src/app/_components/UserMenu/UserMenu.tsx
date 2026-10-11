"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Heart, LogOut, Package, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "_/components/ui/dropdown-menu"

export default function UserMenu() {
  const { data } = useSession()
  const router = useRouter()

  const name = data?.user?.name ?? "Account"
  const email = data?.user?.email
  const initial = name.trim().charAt(0).toUpperCase() || "U"

  async function logout() {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="ml-1 grid size-10 place-items-center rounded-full bg-deep font-heading text-sm font-bold text-white outline-none transition-all duration-200 hover:ring-4 hover:ring-brand/20 focus-visible:ring-4 focus-visible:ring-brand/30 data-[state=open]:ring-4 data-[state=open]:ring-brand/30"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
        <DropdownMenuLabel className="px-2 py-2">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          {email && <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2 py-2">
          <Link href="/profile">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2 py-2">
          <Link href="/orders">
            <Package /> My orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2 py-2">
          <Link href="/wishlist">
            <Heart /> Wishlist
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={logout}
          className="cursor-pointer rounded-lg px-2 py-2"
        >
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}