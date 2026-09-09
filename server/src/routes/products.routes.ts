import { Router } from 'express'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { prisma } from '../prisma.js'
import { productSchema } from '../schemas.js'

const router = Router()

// GET /api/products — public, storefront
router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
  res.json({ products, total: products.length })
})

// POST /api/products — ADMIN only
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const product = await prisma.product.create({ data: parsed.data })
  res.status(201).json(product)
})

// PUT /api/products/:id — ADMIN only
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: 'Invalid id' })
    return
  }
  try {
    // stock is never changed via admin edit: undefined fields are ignored by Prisma
    const product = await prisma.product.update({ where: { id }, data: { ...parsed.data, stock: undefined } })
    res.json(product)
  } catch {
    res.status(404).json({ message: 'Product not found' })
  }
})

// DELETE /api/products/:id — ADMIN only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: 'Invalid id' })
    return
  }
  try {
    await prisma.product.delete({ where: { id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ message: 'Product not found' })
  }
})

export default router
