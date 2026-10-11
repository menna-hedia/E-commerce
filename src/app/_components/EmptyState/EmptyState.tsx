import Link from "next/link"
import { Button } from "_/components/ui/button"

type Props = {
  icon: React.ReactNode
  title: string
  text: string
  href?: string
  cta?: string
}

export default function EmptyState({ icon, title, text, href, cta }: Props) {
  return (
    <div className="fade-up mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-brand [&_svg]:size-7">
        {icon}
      </div>
      <h2 className="mt-6 font-heading text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
      {href && cta && (
        <Button asChild className="mt-6 h-11 rounded-full px-6">
          <Link href={href}>{cta}</Link>
        </Button>
      )}
    </div>
  )
}