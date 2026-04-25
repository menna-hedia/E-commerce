'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "./LoginSchema"
import * as zod from 'zod'
import { LoginAction } from "./login.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from 'next-auth/react';

export type LoginObjectType = zod.infer<typeof loginSchema>

export default function LoginForm() {

  const router = useRouter();

    const { handleSubmit, control } = useForm<LoginObjectType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    async function mySubmit(data: LoginObjectType) {
      const res = await signIn('credentials', { redirect: false, ...data });
          if (res?.ok) {
      toast.success("Welcome To FreshCart", {
        duration: 3000,
        position: "top-center",
      })
      setTimeout(() => {
                router.push('/');
            }, 2000);
    } else {
      toast.error("Invalid Email Or Password", {
        duration: 3000,
        position: "top-center",
      })
    }
// signIn('credentials',data)
  // try {
  //   const isLoggedin = await LoginAction(data)

  //   console.log('log', isLoggedin)

  //   if (isLoggedin) {
  //     toast.success("Welcome To FreshCart", {
  //       duration: 3000,
  //       position: "top-center",
  //     })
  //     setTimeout(() => {
  //               router.push('/');
  //           }, 2000);
  //   } else {
  //     toast.error("Invalid Email Or Password", {
  //       duration: 3000,
  //       position: "top-center",
  //     })
  //   }

  // } catch (error) {
  //   toast.error("Something went wrong", {
  //     duration: 3000,
  //     position: "top-center",
  //   })
  // }
}
   
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <form
        onSubmit={handleSubmit(mySubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5"
      >

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In To Your Account
        </h2>

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                {...field}
                type="email"
                placeholder="Enter email"
                className={`w-full mt-1 px-4 py-2 border rounded-lg 
                ${fieldState.error ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                {...field}
                type="password"
                placeholder="Enter password"
                className={`w-full mt-1 px-4 py-2 border rounded-lg 
                ${fieldState.error ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-700 text-white py-2 rounded-lg transition font-semibold disabled:opacity-50"
       >
        Sign In
        </button>

      </form>
    </div>
  )
}