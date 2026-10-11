"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { toast } from "sonner"
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react"
import { AddressType } from "_/api/types"
import FormField, { SubmitButton } from "../_components/FormField/FormField"
import { addAddress, changePassword, removeAddress, updateProfile } from "./profile.actions"

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
const egyptianPhone = /^01[0125][0-9]{8}$/

const detailsSchema = zod.object({
  name: zod
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(13, "Name must be at most 13 characters"),
  email: zod.string().min(1, "Email is required").email("Email isn't in format"),
  phone: zod.string().regex(/^(01[0125][0-9]{8})?$/, "Phone must be an Egyptian number"),
})

const passwordSchema = zod
  .object({
    currentPassword: zod.string().min(1, "Current password is required"),
    password: zod
      .string()
      .regex(strongPassword, "Min 8 chars, uppercase, lowercase, number & special char"),
    rePassword: zod.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  })

const addressSchema = zod.object({
  name: zod.string().min(2, "Give it a short name, like Home"),
  details: zod.string().min(5, "Enter the full address"),
  phone: zod.string().regex(egyptianPhone, "Phone must be an Egyptian number"),
  city: zod.string().min(2, "Enter the city"),
})

type DetailsValues = zod.infer<typeof detailsSchema>
type PasswordValues = zod.infer<typeof passwordSchema>
type AddressValues = zod.infer<typeof addressSchema>

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/* ------------------------------ Details ------------------------------ */

export function ProfileDetailsForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string
  defaultEmail: string
}) {
  const router = useRouter()
  const { update } = useSession()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: defaultName, email: defaultEmail, phone: "" },
  })

  async function onSubmit(values: DetailsValues) {
    const res = await updateProfile(values)
    if (!res.ok) return toast.error(res.message)

    await update({ name: values.name, email: values.email })
    toast.success(res.message)
    router.refresh()
  }

  return (
    <Panel title="Personal details" description="Update the name and contact info on your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormField {...field} label="Name" autoComplete="name" error={fieldState.error?.message} />
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
              label="Phone (optional)"
              type="tel"
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              error={fieldState.error?.message}
            />
          )}
        />
        <SubmitButton loading={isSubmitting}>Save changes</SubmitButton>
      </form>
    </Panel>
  )
}

/* ------------------------------ Password ------------------------------ */

export function ChangePasswordForm() {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  })

  async function onSubmit(values: PasswordValues) {
    const res = await changePassword(values)
    if (!res.ok) return toast.error(res.message)

    reset()
    toast.success("Password changed. Please sign in again.")
    // The old session token stops working once the password changes.
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <Panel title="Password" description="Choose a strong password you don't use anywhere else.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              {...field}
              label="Current password"
              type="password"
              autoComplete="current-password"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              {...field}
              label="New password"
              type="password"
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
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              error={fieldState.error?.message}
            />
          )}
        />
        <SubmitButton loading={isSubmitting}>Change password</SubmitButton>
      </form>
    </Panel>
  )
}

/* ------------------------------ Addresses ------------------------------ */

export function AddressManager({ addresses }: { addresses: AddressType[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(addresses.length === 0)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  })

  async function onSubmit(values: AddressValues) {
    const res = await addAddress(values)
    if (!res.ok) return toast.error(res.message)

    toast.success(res.message)
    reset()
    setShowForm(false)
    router.refresh()
  }

  async function handleRemove(id: string) {
    setRemovingId(id)
    const res = await removeAddress(id)
    setRemovingId(null)

    if (res.ok) {
      toast.success(res.message)
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <Panel
      title="Addresses"
      description="Saved addresses make checkout faster."
      action={
        !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-brand-foreground transition-all duration-200 hover:bg-brand/90 active:scale-95"
          >
            <Plus className="size-4" />
            Add
          </button>
        )
      }
    >
      {addresses.length > 0 && (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a._id}
              className="flex items-start gap-4 rounded-xl p-4 ring-1 ring-border animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-brand">
                <MapPin className="size-5" />
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{a.name}</p>
                <p className="mt-0.5 text-muted-foreground">
                  {a.details}, {a.city}
                </p>
                <p className="text-muted-foreground">{a.phone}</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${a.name}`}
                disabled={removingId === a._id}
                onClick={() => handleRemove(a._id)}
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 disabled:opacity-50"
              >
                {removingId === a._id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={`space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 ${addresses.length ? "mt-6 border-t pt-6" : ""}`}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <FormField {...field} label="Name" placeholder="Home, Work..." error={fieldState.error?.message} />
            )}
          />
          <Controller
            name="details"
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                {...field}
                label="Address"
                placeholder="Street, building, apartment"
                autoComplete="street-address"
                error={fieldState.error?.message}
              />
            )}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <FormField {...field} label="City" autoComplete="address-level2" error={fieldState.error?.message} />
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
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <SubmitButton loading={isSubmitting}>Save address</SubmitButton>
            </div>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  reset()
                  setShowForm(false)
                }}
                className="h-12 rounded-xl px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </Panel>
  )
}