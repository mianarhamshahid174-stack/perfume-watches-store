import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password exceeds maximum length"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset token"),
  newPassword: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password exceeds maximum length"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Please provide a valid admin email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
