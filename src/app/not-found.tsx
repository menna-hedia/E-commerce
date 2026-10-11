import { Compass } from "lucide-react"
import EmptyState from "./_components/EmptyState/EmptyState"

export default function NotFound() {
  return (
    <EmptyState
      icon={<Compass />}
      title="Page not found"
      text="The page you're looking for doesn't exist or has moved."
      href="/"
      cta="Back to home"
    />
  )
}