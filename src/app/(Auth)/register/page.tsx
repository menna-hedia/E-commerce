'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "./RegisterSchema"
import * as zod from 'zod'
import { RegisterAction } from "./register.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export type RegisterObjectType = zod.infer<typeof registerSchema>

export default function RegisterForm() {

  const router = useRouter();

    const { handleSubmit, control } = useForm<RegisterObjectType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            rePassword: ""
        }
    });

    async function mySubmit(data: RegisterObjectType) {
  try {
    const isRegisteredSuccessfully = await RegisterAction(data)

    console.log('log', isRegisteredSuccessfully)

    if (isRegisteredSuccessfully) {
      toast.success("Account created successfully", {
        duration: 3000,
        position: "top-center",
      })
      setTimeout(() => {
                router.push('/login');
            }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <form
        onSubmit={handleSubmit(mySubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5"
      >

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        {/* Username */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                {...field}
                placeholder="Enter username"
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

        {/* Phone */}
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone
              </label>
              <input
                {...field}
                type="tel"
                placeholder="Enter phone"
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

        {/* Confirm Password */}
        <Controller
          name="rePassword"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                {...field}
                type="password"
                placeholder="Confirm password"
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
        Sign Up
        </button>

      </form>
    </div>
  )
}