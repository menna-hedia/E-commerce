'use client'

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "_/lib/utils"
import AuthShell from "../../_components/AuthShell/AuthShell"
import FormField, { SubmitButton } from "../../_components/FormField/FormField"
import { forgotPassword, resetPassword, verifyResetCode } from "./forgot.actions"

type Step = "email" | "code" | "password"

const steps: Step[] = ["email", "code", "password"]

const copy: Record<Step, { title: string; description: string }> = {
  email: {
    title: "Forgot your password?",
    description: "Enter your email and we'll send you a code to reset it.",
  },
  code: {
    title: "Check your email",
    description: "Enter the code we sent you. It expires after a few minutes.",
  },
  password: {
    title: "Choose a new password",
    description: "Pick something strong that you don't use anywhere else.",
  },
}

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const stepIndex = steps.indexOf(step)

  async function resend() {
    const res = await forgotPassword(email.trim())
    if (res.ok) toast.success("A new code is on its way")
    else toast.error(res.message)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (step === "email") {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Email isn't in format")
      setBusy(true)
      const res = await forgotPassword(email.trim())
      setBusy(false)
      if (!res.ok) return setError(res.message)
      toast.success(res.message)
      return setStep("code")
    }

    if (step === "code") {
      if (!code.trim()) return setError("Enter the code from your email")
      setBusy(true)
      const res = await verifyResetCode(code.trim())
      setBusy(false)
      if (!res.ok) return setError(res.message)
      return setStep("password")
    }

    if (!strongPassword.test(password))
      return setError("Min 8 chars, uppercase, lowercase, number & special char")
    if (password !== confirm) return setError("Passwords do not match")

    setBusy(true)
    const res = await resetPassword(email.trim(), password)
    setBusy(false)
    if (!res.ok) return setError(res.message)

    toast.success("Password updated. Sign in with your new password.")
    router.push("/login")
  }

  return (
    <AuthShell
      title={copy[step].title}
      description={copy[step].description}
      footer={
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="mb-8 flex gap-2" aria-hidden>
        {steps.map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i <= stepIndex ? "bg-brand" : "bg-secondary"
            )}
          />
        ))}
      </div>

      <form
        key={step}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {step === "email" && (
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            error={error}
          />
        )}

        {step === "code" && (
          <>
            <FormField
              label="Reset code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className="text-center text-lg tracking-[0.4em]"
              autoFocus
              error={error}
            />
            <p className="text-sm text-muted-foreground">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={resend}
                className="font-semibold text-brand hover:underline"
              >
                Send a new code
              </button>
            </p>
          </>
        )}

        {step === "password" && (
          <>
            <FormField
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
            />
            <FormField
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={error}
            />
          </>
        )}

        <SubmitButton loading={busy}>
          {step === "email" ? "Send code" : step === "code" ? "Verify code" : "Update password"}
        </SubmitButton>
      </form>
    </AuthShell>
  )
}