import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().max(50).optional(),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'Enter your password'),
})

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v

export const productSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().trim().min(1, 'Add a description'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  thumbnail: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  brand: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  category: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductInput = z.infer<typeof productSchema>
