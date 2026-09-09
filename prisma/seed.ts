// Seed: admin + demo products. Run: npm run db:seed  (or npx prisma db seed)
// Idempotent: re-running updates products (matched by old title),
// never skips them or creates duplicates.
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SeedProduct {
  /** Old title in the DB (if the product is being renamed) */
  match?: string
  data: {
    title: string
    description: string
    price: number
    thumbnail: string | null
    stock: number
    brand: string | null
    category: string | null
  }
}

const products: SeedProduct[] = [
  {
    data: {
      title: 'Essence Mascara Lash Princess',
      description: 'A popular mascara for a striking look. Long-lasting formula, handy brush.',
      price: 9.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
      stock: 44,
      brand: 'Essence',
      category: 'beauty',
    },
  },
  {
    data: {
      title: 'Apple MacBook Pro 14',
      description: 'Laptop with M4 chip, 16 GB of RAM and 512 GB SSD. For work and development.',
      price: 1999.0,
      thumbnail: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
      stock: 12,
      brand: 'Apple',
      category: 'laptops',
    },
  },
  {
    match: 'Sony WH-1000XM5',
    data: {
      title: 'Apple AirPods Max Silver',
      description: 'Premium over-ear headphones: high-fidelity sound, adaptive EQ and active noise cancellation.',
      price: 549.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp',
      stock: 59,
      brand: 'Apple',
      category: 'mobile-accessories',
    },
  },
  {
    match: 'Logitech MX Master 3S',
    data: {
      title: 'Apple Watch Series 4 Gold',
      description: 'A stylish smartwatch: heart-rate monitor, fitness tracking and a bright Retina display.',
      price: 349.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp',
      stock: 33,
      brand: 'Apple',
      category: 'mobile-accessories',
    },
  },
  {
    match: 'Samsung Galaxy S24',
    data: {
      title: 'Samsung Galaxy S10',
      description: 'A flagship with a Dynamic AMOLED display, versatile camera and powerful hardware.',
      price: 699.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp',
      stock: 19,
      brand: 'Samsung',
      category: 'smartphones',
    },
  },
  {
    match: 'Ikea Markus Chair',
    data: {
      title: 'Knoll Saarinen Executive Conference Chair',
      description: 'A modern ergonomic chair for the office and conference room. Timeless design.',
      price: 499.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp',
      stock: 26,
      brand: 'Knoll',
      category: 'furniture',
    },
  },
  {
    match: 'Nike Air Zoom Pegasus',
    data: {
      title: 'Nike Air Jordan 1 Red And Black',
      description: 'Iconic basketball sneakers: stylish design and great on-court performance.',
      price: 149.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp',
      stock: 7,
      brand: 'Nike',
      category: 'mens-shoes',
    },
  },
  {
    match: 'Kindle Paperwhite',
    data: {
      title: 'iPad Mini 2021 Starlight',
      description: 'A compact and powerful tablet: Retina display, A-series chip, slim body.',
      price: 499.99,
      thumbnail: 'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp',
      stock: 47,
      brand: 'Apple',
      category: 'tablets',
    },
  },
]

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@gmail.com',
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log(`admin ok: ${admin.email} (id=${admin.id})`)

  for (const p of products) {
    // match both the legacy title and the current one, so re-runs never duplicate
    const lookupTitles = p.match ? [p.match, p.data.title] : [p.data.title]
    const existing = await prisma.product.findFirst({ where: { title: { in: lookupTitles } } })
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: p.data })
      console.log(`updated: ${p.data.title} (id=${existing.id})`)
    } else {
      const created = await prisma.product.create({ data: p.data })
      console.log(`created: ${created.title} (id=${created.id})`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
