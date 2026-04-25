import * as zod from 'zod'

// validation 
export const loginSchema = zod.object({
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
})