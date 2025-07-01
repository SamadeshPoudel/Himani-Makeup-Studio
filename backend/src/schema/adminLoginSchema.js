import { z } from "zod";

const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(12, { message: "Password must be no more than 12 characters" }),
});

export default adminLoginSchema;