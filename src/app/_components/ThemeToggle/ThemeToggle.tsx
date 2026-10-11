"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Check, Monitor, Moon, Sun } from "lucide-react"

import { cn } from "_/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "_/components/ui/dropdown-menu"

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // next-themes only knows the real theme on the client; wait to avoid a hydration mismatch.
  React.useEffect(() => setMounted(true), [])

  const active = mounted ? theme : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change theme"
          className={cn(
            "relative grid size-10 place-items-center rounded-full text-foreground/70 outline-none transition-all duration-200 hover:bg-secondary hover:text-foreground focus-visible:ring-4 focus-visible:ring-brand/30 active:scale-90 data-[state=open]:bg-secondary data-[state=open]:text-foreground",
            className
          )}
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="cursor-pointer gap-2 rounded-lg px-2 py-2"
          >
            <Icon /> {label}
            {active === value && <Check className="ml-auto size-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}