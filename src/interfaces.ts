// Product type = what our API returns (Prisma Product).
// Compatible with the cart: the cart stores the same objects.
export interface IProduct {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string | null
  stock: number
  brand: string | null
  category: string | null
  setStock?: (newStock: number) => void
}

export interface IProductsResponse {
  products: IProduct[]
  total: number
}

export type Role = 'USER' | 'ADMIN'

export interface IUser {
  id: number
  email: string
  name: string | null
  role: Role
}
