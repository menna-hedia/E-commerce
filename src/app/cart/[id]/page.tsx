"use client"

import { useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createCashOrder, createOnlineOrderAction } from "../cart.actions"
import { toast } from "sonner"
import { OrderPlaceType } from "_/api/types"
import { Button } from "_/components/ui/button"

export default function CheckoutPage() {
  const router = useRouter()
  const { id } = useParams()

  const detailsInput = useRef<HTMLInputElement>(null)
  const phoneInput = useRef<HTMLInputElement>(null)
  const cityInput = useRef<HTMLInputElement>(null)
  const postalCodeInput = useRef<HTMLInputElement>(null)

  async function handleCashOrder() {
    const obj: OrderPlaceType = {
      shippingAddress: {
        details: detailsInput.current?.value || "",
        phone: phoneInput.current?.value || "",
        city: cityInput.current?.value || "",
        postalCode: postalCodeInput.current?.value || "",
      },
    }

    try {
      const res = await createCashOrder(id?.toString() || "", obj)

      if (res) {
     
        toast.success("Order created successfully", {
          duration: 3000,
          position: "top-center",
        })

        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        throw new Error("Failed")
      }

    } catch (err) {
      toast.error("Something went wrong with cash order", {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  async function handleCheckoutSessionOrder() {
    const obj: OrderPlaceType = {
      shippingAddress: {
        details: detailsInput.current?.value || '',
        phone: phoneInput.current?.value || '',
        city: cityInput.current?.value || '',
        postalCode: postalCodeInput.current?.value || '',
      }
    }

    try {
      const link = await createOnlineOrderAction(id?.toString() || '', obj);

      if (link) {
        
        toast.success("Redirecting to payment gateway...", {
          duration: 3000,
          position: "top-center",
        })

       
        setTimeout(() => {
          window.open(link, '_self');
        }, 2000);
      } else {
        toast.error("Could not create payment session", {
          duration: 3000,
          position: "top-center",
        })
      }
    } catch (error) {
      toast.error("An error occurred during online checkout", {
        duration: 3000,
        position: "top-center",
      })
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div
   
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5"
      >

        <h2 className="text-2xl font-bold text-center">
          Checkout
        </h2>

        <input ref={detailsInput} placeholder="Details"
          className="w-full p-3 border rounded-xl" />

        <input ref={phoneInput} placeholder="Phone"
          className="w-full p-3 border rounded-xl" />

        <input ref={cityInput} placeholder="City"
          className="w-full p-3 border rounded-xl" />

        <input ref={postalCodeInput} placeholder="Postal Code"
          className="w-full p-3 border rounded-xl" />

        <Button className="w-full p-6 rounded-xl bg-green-600" onClick={handleCashOrder}>Create Cash order</Button>
      <Button className="w-full p-6 rounded-xl" onClick={handleCheckoutSessionOrder}>Create Online order</Button>

   </div>
    </div>
  )
}