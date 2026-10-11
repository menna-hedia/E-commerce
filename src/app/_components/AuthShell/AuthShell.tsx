import Link from "next/link"
import { Check, Leaf } from "lucide-react"

const perks = [
  "Fast & free delivery",
  "Fresh products at your door",
  "Premium quality guaranteed",
]

type Props = {
  title: string
  description: string
  footer: React.ReactNode
  children: React.ReactNode
}

export default function AuthShell({ title, description, footer, children }: Props) {
  return (
    <div className="grid min-h-[calc(100svh-4.5rem)] lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-deep p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Leaf className="size-4" />
          </span>
          FreshCart
        </Link>

        <div>
          <h2
            className="fade-up max-w-md font-heading text-5xl font-bold leading-[1.05]"
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            Fresh food, one tap away.
          </h2>

          <ul className="mt-10 space-y-4">
            {perks.map((perk, i) => (
              <li
                key={perk}
                className="fade-up flex items-center gap-3 text-white/85"
                style={{ "--d": `${350 + i * 130}ms` } as React.CSSProperties}
              >
                <span className="grid size-6 place-items-center rounded-full bg-brand text-brand-foreground">
                  <Check className="size-3.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/50">© {new Date().getFullYear()} FreshCart</p>
      </aside>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div
          className="fade-up w-full max-w-md"
          style={{ "--d": "100ms" } as React.CSSProperties}
        >
          <h1 className="font-heading text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>
    </div>
  )
}