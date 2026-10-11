type Props = {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}