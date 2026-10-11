'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "./RegisterSchema"
import * as zod from 'zod'
import { RegisterAction } from "./register.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthShell from "../../_components/AuthShell/AuthShell"
import FormField, { SubmitButton } from "../../_components/FormField/FormField"

export type RegisterObjectType = zod.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<RegisterObjectType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      rePassword: "",
    },
  })

  async function mySubmit(data: RegisterObjectType) {
    try {
      const isRegisteredSuccessfully = await RegisterAction(data)

      if (isRegisteredSuccessfully) {
        toast.success("Account created successfully", {
          duration: 3000,
          position: "top-center",
        })
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        toast.error("Account already exists", {
          duration: 3000,
          position: "top-center",
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  return (
    <AuthShell
      title="Create your account"
      description="It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(mySubmit)} className="space-y-5" noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              {...field}
              label="Username"
              placeholder="Your name"
              autoComplete="name"
              error={fieldState.error?.message}
            />
          )}
        />

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

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              {...field}
              label="Phone"
              type="tel"
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                {...field}
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="rePassword"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                {...field}
                label="Confirm password"
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <SubmitButton loading={isSubmitting}>Create account</SubmitButton>
      </form>
    </AuthShell>
  )
}