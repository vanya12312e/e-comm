import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../prisma.js'
import { loginSchema, registerSchema } from '../schemas.js'
import { COOKIE_NAME, cookieOptions, signToken } from '../utils/jwt.js'

const router = Router()

function toPublicUser(user: { id: number; email: string; name: string | null; role: 'USER' | 'ADMIN' }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

// POST /api/auth/register — always USER role (admin granted via seed/SQL)
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const { email, password, name } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(409).json({ message: 'Email is already registered' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || null },
  })

  res.cookie(COOKIE_NAME, signToken({ sub: user.id, role: user.role }), cookieOptions())
  res.status(201).json(toPublicUser(user))
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }
  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  res.cookie(COOKIE_NAME, signToken({ sub: user.id, role: user.role }), cookieOptions())
  res.json(toPublicUser(user))
})

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  res.json({ ok: true })
})

// GET /api/auth/me — for ProtectedRoute / session restore
router.get('/me', requireAuth, (_req, res) => {
  res.json(res.locals.user)
})

export default router
