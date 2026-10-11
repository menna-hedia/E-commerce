import type { Metadata } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { Heart, Package, ShoppingBag } from "lucide-react"
import { nextAuthConfig } from "_/nextAuth/nextAuth.config"
import { getUserAddresses } from "_/api/services/routeServices"
import LogoutButton from "../_components/Navbar/LogoutButton"
import { AddressManager, ChangePasswordForm, ProfileDetailsForm } from "./ProfileSections"

export const metadata: Metadata = { title: "Profile" }

const quickLinks = [
  { href: "/orders", label: "My orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
]

export default async function ProfilePage() {
  const [session, addresses] = await Promise.all([
    getServerSession(nextAuthConfig),
    getUserAddresses(),
  ])

  const name = session?.user?.name ?? "Your account"
  const email = session?.user?.email ?? ""

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="fade-up flex flex-wrap items-center gap-5 rounded-3xl bg-deep p-6 text-white sm:p-8">
        <span className="grid size-16 place-items-center rounded-full bg-brand font-heading text-2xl font-bold text-brand-foreground">
          {name.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-2xl font-bold sm:text-3xl">{name}</h1>
          <p className="truncate text-white/70">{email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/20 active:scale-95"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <ProfileDetailsForm defaultName={name === "Your account" ? "" : name} defaultEmail={email} />
          <ChangePasswordForm />
        </div>

        <div className="space-y-8">
          <AddressManager addresses={addresses} />
          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}