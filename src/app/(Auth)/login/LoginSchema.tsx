import * as zod from 'zod'

// Login only checks the fields are filled in. The strength rules belong on sign-up,
// otherwise people with older passwords can't get in.
export const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, "Email is required")
    .email("Email isn't in format"),

  password: zod
    .string()
    .min(1, "Password is required"),
})