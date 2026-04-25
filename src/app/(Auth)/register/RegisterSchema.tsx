import * as zod from 'zod'

// validation 
export const registerSchema = zod.object({
  name: zod
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(13, "Name must be Maximum 13 characters"),

  email: zod
    .string()
    .email("Email isn't in format")
    .nonempty("Email is required"),

  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Min 8 chars, uppercase, lowercase, number & special char"
    ),

  rePassword: zod
    .string()
    .nonempty("Confirm password is required"),

  phone: zod
    .string()
    .nonempty("Phone is required")
    .regex(/^01[0125][0-9]{8}$/, "Phone must be Egyptian number"),
})
.refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
})