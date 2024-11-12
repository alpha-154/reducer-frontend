import { z } from "zod";

// Defining Form Schema Validation with Zod For User Registration Process
const formRegisterSchema = z.object({
    userName: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
    }),
    profileImage: z.string().nullable(),
  });


// Defining Form Schema Validation with Zod For User Login Process
const formLoginSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

  export {
    formRegisterSchema,
    formLoginSchema
  }