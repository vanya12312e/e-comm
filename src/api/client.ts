import axios from 'axios'

// In dev, '/api' is proxied by Vite to http://localhost:3000 (see vite.config.ts).
// In prod, frontend and API live on the same domain — also works with no env vars.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // required: auth via httpOnly cookie
})

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export function apiErrorMessage(e: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiError>(e)) {
    return e.response?.data?.message ?? fallback
  }
  return fallback
}
