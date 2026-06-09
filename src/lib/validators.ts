import { z } from "zod"

export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, "Category name is required")
  .max(50, "Category name must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_\s-]+$/, "Category name can only contain letters, numbers, spaces, hyphens, and underscores")

export const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
  emoji: z.string().emoji("Invalid emoji").optional(),
})

export type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

export const SIGN_IN_VALIDATOR = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type SignInForm = z.infer<typeof SIGN_IN_VALIDATOR>

export const SIGN_UP_VALIDATOR = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignUpForm = z.infer<typeof SIGN_UP_VALIDATOR>

export const DISCORD_ID_VALIDATOR = z.object({
  discordId: z.string().min(1, "Discord ID is required"),
})

export type DiscordIdForm = z.infer<typeof DISCORD_ID_VALIDATOR>
