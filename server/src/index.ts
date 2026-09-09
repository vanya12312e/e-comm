// Start: npm run server:dev   (http://localhost:3000, frontend hits it via Vite /api proxy)
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import authRoutes from './routes/auth.routes.js'
import productsRoutes from './routes/products.routes.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT ?? 3000)
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)

// 404 for unknown /api routes
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
})
