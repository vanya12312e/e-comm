import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../prisma.js'
import { COOKIE_NAME, verifyToken } from '../utils/jwt.js'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
}

// Puts the user into res.locals.user
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined
  if (!token) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }
  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    res.locals.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } satisfies AuthUser
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user as AuthUser | undefined
  if (!user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }
  if (user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access only' })
    return
  }
  next()
}
