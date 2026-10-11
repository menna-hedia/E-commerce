'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "./LoginSchema"
import * as zod from 'zod'
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from 'next-auth/react'
import Link from "next/link"
import AuthShell from "../../_components/AuthShell/AuthShell"
import FormField, { SubmitButton } from "../../_components/FormField/FormField"

export type LoginObjectType = zod.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Only follow local paths, never another site.
  const rawCallback = searchParams.get("callbackUrl")
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/"

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginObjectType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function mySubmit(data: LoginObjectType) {
    const res = await signIn('credentials', { redirect: false, ...data })

    if (res?.ok) {
      toast.success("Welcome to FreshCart", {
        duration: 3000,
        position: "top-center",
      })
      setTimeout(() => {
        router.push(callbackUrl)
        router.refresh()
      }, 700)
    } else {
      toast.error("Invalid email or password", {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to see your cart, orders and wishlist."
      footer={
        <>
          New to FreshCart?{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(mySubmit)} className="space-y-5" noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              {...field}
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={fieldState.error?.message}
            />
          )}
        />

        <div>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                {...field}
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={fieldState.error?.message}
              />
            )}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <SubmitButton loading={isSubmitting}>Sign in</SubmitButton>
      </form>
    </AuthShell>
  )
}