'use client'

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground/80 transition-all duration-200 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95"
    >
      <LogOut size={16} />
      Logout
    </button>
  )
}