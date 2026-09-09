# E-Comm Redux — інтернет-магазин

Навчальний full-stack проєкт: вітрина товарів із кошиком, приватна адмінка для керування товарами та базова реєстрація/авторизація користувачів.

## Що вміє проєкт

- **Вітрина (`/`)** — сітка товарів із фото, цінами й описами; кнопка Add to Cart / Remove From Cart; кошик у модальному вікні із загальною сумою.
- **Авторизація (`/login`, `/register`)** — форми на Ant Design, сесія через JWT у httpOnly cookie, ролі `USER` / `ADMIN`.
- **Адмінка (`/admin`, тільки для ADMIN)** — таблиця товарів, створення/редагування через модальну форму, видалення з підтвердженням. Неавторизованих редіректить на `/login`, звичайних юзерів — на `/`.
- **API** — товарини доступні публічно (`GET /api/products`), створення/зміна/видалення — лише для адміна (401/403 для інших).

## Стек технологій

**Фронтенд:**
- React 19 + TypeScript + Vite
- Redux Toolkit + React Redux (кошик, сесія)
- React Router (маршрути `/`, `/login`, `/register`, `/admin` + гарди)
- Ant Design + Tailwind CSS
- Axios (`withCredentials` для cookie-авторизації)

**Бекенд (`server/`):**
- Node.js + Express 5 + TypeScript (запуск через `tsx`)
- Prisma ORM 6 + PostgreSQL 17 (локальна БД)
- Авторизація: `jsonwebtoken` + `bcryptjs`, cookie через `cookie-parser`
- Валідація: `zod`; CORS з `credentials: true`

**Інструменти:** ESLint, Prisma Migrate/Studio, Vite-проксі `/api → http://localhost:3000`.

## Структура

```
├── src/                    # фронт: pages, components, slices, api-клієнт
├── server/src/             # API: routes (auth, products), middleware, schemas
├── prisma/                 # schema.prisma, міграції, seed (адмін + 8 товарів)
├── .env                    # DATABASE_URL, JWT_SECRET, PORT, CLIENT_URL (не в гіті)
└── vite.config.ts          # + dev-проксі /api
```

## Запуск локально

1. Встанови PostgreSQL 17 і створи базу:
   ```sql
   CREATE DATABASE ecomm;
   ```
2. Налаштуй `.env` (приклад — `.env.example`).
3. Встанови залежності й підготуй БД:
   ```powershell
   npm install
   npm run db:migrate   # prisma migrate dev
   npm run db:seed      # адмін + демо-товари (ідемпотентний)
   ```
4. Запусти два процеси:
   ```powershell
   npm run server:dev   # API на http://localhost:3000
   npm run dev          # фронт на http://localhost:5173
   ```

## Корисні скрипти

| Команда | Призначення |
|---|---|
| `npm run dev` | фронт (Vite) |
| `npm run server:dev` | API (tsx) |
| `npm run build` | `tsc -b` + production-білд |
| `npm run lint` | ESLint |
| `npm run db:migrate` | застосувати міграції |
| `npm run db:seed` | пересоздати/оновити seed-дані |
| `npm run db:studio` | Prisma Studio (перегляд БД у браузері) |

## Доступи за замовчуванням

- Адмін: `admin@gmail.com` (пароль із seed — `admin123`, якщо не змінювався; зміна — через SQL `UPDATE users ...` або Prisma Studio)
- Звичайні користувачі реєструються самі через `/register` (роль завжди `USER`; адміна видає seed або SQL: `UPDATE users SET role='ADMIN' WHERE email='...'`)

## API (стисло)

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/products` — публічний
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` — заголовок cookie-сесії + роль `ADMIN`
