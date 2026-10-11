"use client"

import * as React from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "_/lib/utils"

type FormFieldProps = React.ComponentProps<"input"> & {
  label: string
  error?: string
}

export default function FormField({
  label,
  error,
  id,
  type = "text",
  className,
  ...props
}: FormFieldProps) {
  const [show, setShow] = React.useState(false)
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const isPassword = type === "password"

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={fieldId}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            "h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus:border-brand focus:ring-4 focus:ring-brand/15",
            isPassword && "pr-12",
            error &&
              "animate-shake border-destructive focus:border-destructive focus:ring-destructive/15",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${fieldId}-error`}
          className="mt-1.5 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/25 active:scale-[0.98] disabled:opacity-70"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}