"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Banknote, CreditCard, Loader2, Lock } from "lucide-react"
import { AddressType, OrderPlaceType } from "_/api/types"
import { cn } from "_/lib/utils"
import FormField from "../../_components/FormField/FormField"
import { addAddress } from "../../profile/profile.actions"
import { createCashOrder, createOnlineOrderAction } from "../cart.actions"

type Item = { id: string; title: string; image: string; count: number; price: number }

type Props = {
  cartId: string
  items: Item[]
  total: number
  addresses: AddressType[]
}

type Payment = "cash" | "online"

type NewAddress = { label: string; details: string; phone: string; city: string }

function validate(form: NewAddress) {
  const errors: Partial<Record<keyof NewAddress, string>> = {}
  if (form.details.trim().length < 5) errors.details = "Enter your full address"
  if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) errors.phone = "Phone must be an Egyptian number"
  if (form.city.trim().length < 2) errors.city = "Enter your city"
  return errors
}

function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label className="relative block cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <div className="rounded-2xl p-4 ring-1 ring-border transition-all duration-200 hover:ring-brand/40 peer-checked:bg-brand/5 peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">
        {children}
      </div>
    </label>
  )
}

export default function CheckoutForm({ cartId, items, total, addresses }: Props) {
  const router = useRouter()

  const [selected, setSelected] = useState<string>(addresses[0]?._id ?? "new")
  const [payment, setPayment] = useState<Payment>("cash")
  const [form, setForm] = useState<NewAddress>({ label: "Home", details: "", phone: "", city: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof NewAddress, string>>>({})
  const [saveAddress, setSaveAddress] = useState(false)
  const [busy, setBusy] = useState(false)

  const itemCount = items.reduce((n, i) => n + i.count, 0)

  function setField(key: keyof NewAddress, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function placeOrder() {
    let order: OrderPlaceType

    if (selected === "new") {
      const found = validate(form)
      setErrors(found)
      if (Object.keys(found).length) return toast.error("Check the highlighted fields")

      order = {
        shippingAddress: {
          details: form.details.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          postalCode: "",
        },
      }
    } else {
      const a = addresses.find((x) => x._id === selected)
      if (!a) return toast.error("Choose a delivery address")
      order = {
        shippingAddress: { details: a.details, phone: a.phone, city: a.city, postalCode: "" },
      }
    }

    setBusy(true)
    try {
      if (selected === "new" && saveAddress) {
        await addAddress({
          name: form.label.trim() || "Home",
          details: form.details.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
        })
      }

      if (payment === "cash") {
        const res = await createCashOrder(cartId, order)
        if (!res) throw new Error("cash order failed")

        toast.success("Order placed. We'll get it to you soon.")
        router.refresh()
        router.push("/orders")
      } else {
        const link = await createOnlineOrderAction(cartId, order)
        if (!link) throw new Error("no payment session")

        toast.success("Taking you to the payment page...")
        window.location.href = link
      }
    } catch {
      toast.error(
        payment === "cash"
          ? "We couldn't place your order. Please try again."
          : "We couldn't start the payment. Please try again."
      )
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-8">
          {/* Address */}
          <section className="fade-up rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
            <h2 className="font-heading text-xl font-bold">Delivery address</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addresses.map((a) => (
                <Choice key={a._id} name="address" checked={selected === a._id} onChange={() => setSelected(a._id)}>
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.details}, {a.city}
                  </p>
                  <p className="text-sm text-muted-foreground">{a.phone}</p>
                </Choice>
              ))}

              <Choice name="address" checked={selected === "new"} onChange={() => setSelected("new")}>
                <p className="font-semibold">Use a new address</p>
                <p className="mt-1 text-sm text-muted-foreground">Enter where this order should go.</p>
              </Choice>
            </div>

            {selected === "new" && (
              <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <FormField
                  label="Address"
                  value={form.details}
                  onChange={(e) => setField("details", e.target.value)}
                  placeholder="Street, building, apartment"
                  autoComplete="street-address"
                  error={errors.details}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="City"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    autoComplete="address-level2"
                    error={errors.city}
                  />
                  <FormField
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="01xxxxxxxxx"
                    autoComplete="tel"
                    error={errors.phone}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="size-4 accent-[var(--brand)]"
                  />
                  Save this address for next time
                </label>

                {saveAddress && (
                  <div className="animate-in fade-in duration-200">
                    <FormField
                      label="Address name"
                      value={form.label}
                      onChange={(e) => setField("label", e.target.value)}
                      placeholder="Home, Work..."
                    />
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Payment */}
          <section
            className="fade-up rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            <h2 className="font-heading text-xl font-bold">Payment</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Choice name="payment" checked={payment === "cash"} onChange={() => setPayment("cash")}>
                <Banknote className="size-6 text-brand" />
                <p className="mt-3 font-semibold">Cash on delivery</p>
                <p className="mt-1 text-sm text-muted-foreground">Pay when your order arrives.</p>
              </Choice>

              <Choice name="payment" checked={payment === "online"} onChange={() => setPayment("online")}>
                <CreditCard className="size-6 text-brand" />
                <p className="mt-3 font-semibold">Pay online</p>
                <p className="mt-1 text-sm text-muted-foreground">Secure card payment.</p>
              </Choice>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside
          className="fade-up rounded-2xl bg-card p-6 ring-1 ring-border lg:sticky lg:top-24"
          style={{ "--d": "140ms" } as React.CSSProperties}
        >
          <h2 className="font-heading text-xl font-bold">Order summary</h2>

          <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                  <span className="absolute -right-0 -top-0 grid min-w-5 place-items-center rounded-bl-lg bg-deep px-1 text-[11px] font-bold leading-5 text-white">
                    {item.count}
                  </span>
                </span>
                <p className="line-clamp-2 min-w-0 flex-1 text-sm">{item.title}</p>
                <p className="text-sm font-semibold">
                  {(item.price * item.count).toLocaleString("en-US")}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd>{itemCount}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="font-heading text-xl font-bold">{total.toLocaleString("en-US")} EGP</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={placeOrder}
            disabled={busy}
            className={cn(
              "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-brand-foreground transition-all duration-200",
              "hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/25 active:scale-[0.98] disabled:opacity-70"
            )}
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />}
            {payment === "cash" ? "Place order" : "Continue to payment"}
          </button>
        </aside>
      </div>
    </div>
  )
}