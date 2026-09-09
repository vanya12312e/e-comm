import jwt from 'jsonwebtoken'

export interface JwtPayload {
  sub: number
  role: 'USER' | 'ADMIN'
}

const COOKIE_NAME = 'token'

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set in .env')
  return secret
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? '7d'
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    // in dev over http — false; behind a reverse proxy with https set it to true
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  }
}

export { COOKIE_NAME }
