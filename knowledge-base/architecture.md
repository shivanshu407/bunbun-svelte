# Architecture

## System Overview
BunBunClothing is a server-side rendered e-commerce store built with SvelteKit 2. It uses a monolithic architecture where the frontend, backend API, and admin panel are all served from a single SvelteKit application deployed on Hostinger shared hosting. Data is stored in MariaDB via Prisma ORM, images are hosted on Cloudinary CDN, and authentication is handled by Lucia v3 with cookie-based sessions.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                    │
│  (SSR HTML + Svelte hydration + fetch API calls)     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────┐
│              Hostinger Nginx Reverse Proxy            │
│              (SSL termination, static files)          │
└──────────────────────┬───────────────────────────────┘
                       │ :3000
                       ▼
┌──────────────────────────────────────────────────────┐
│              SvelteKit Node.js Server                 │
│  ┌────────────────────────────────────────────────┐  │
│  │ hooks.server.ts                                 │  │
│  │ (auth middleware, rate limiting, security hdrs)  │  │
│  └────────────────┬───────────────────────────────┘  │
│                   │                                   │
│  ┌────────────────┼───────────────────────────────┐  │
│  │  Routes        │                                │  │
│  │  ├── Public    │ (/, /products, /category)      │  │
│  │  ├── Auth      │ (/login, /register, /logout)   │  │
│  │  ├── Account   │ (/account/*, /checkout)        │  │
│  │  ├── Admin     │ (/admin/* — role-gated)        │  │
│  │  └── API       │ (/api/cart, /api/upload, etc)  │  │
│  └────────────────┼───────────────────────────────┘  │
│                   │                                   │
│  ┌────────────────┼───────────────────────────────┐  │
│  │  Server Libs   │                                │  │
│  │  ├── db.ts     │ (Prisma Proxy lazy init)       │  │
│  │  ├── auth.ts   │ (Lucia v3 + Prisma adapter)    │  │
│  │  └── cloud*.ts │ (Cloudinary lazy getter)       │  │
│  └────────────────┼───────────────────────────────┘  │
└───────────────────┼──────────────────────────────────┘
                    │
         ┌──────────┼──────────┐
         ▼                     ▼
┌─────────────────┐   ┌────────────────┐
│   MariaDB       │   │   Cloudinary   │
│ auth-db1953     │   │   CDN          │
│ .hstgr.io:3306  │   │   (images)     │
└─────────────────┘   └────────────────┘
```

## Layers & Responsibilities
| Layer         | Technology              | Responsibility                                          |
|---------------|-------------------------|---------------------------------------------------------|
| Frontend      | Svelte 5 + SvelteKit 2  | SSR pages, client hydration, form actions, stores       |
| Backend/API   | SvelteKit server routes | REST endpoints (/api/*), form actions, auth middleware  |
| Database      | MariaDB + Prisma ORM    | All persistent data (users, products, orders, carts)    |
| Auth          | Lucia v3 + bcryptjs     | Session cookies, password hashing, role-based access    |
| Storage       | Cloudinary              | Product/banner image hosting and CDN delivery           |
| CDN/Hosting   | Hostinger + Nginx       | SSL, static files, reverse proxy to Node.js             |

## Data Flow

### User Signup
1. `POST /register` → validate name/email/password → bcrypt hash → `prisma.user.create()` → Lucia session → set cookie → redirect

### Product Purchase
1. Browse `/products` → click "Add to Cart" → `POST /api/cart` (auth required) → `prisma.cartItem.create()`
2. Navigate to `/checkout` → select address, payment, coupon → `POST /checkout?/placeOrder`
3. Server recalculates coupon, verifies address ownership → `prisma.$transaction()` creates Order + OrderItems + decrements stock + clears cart
4. Redirect to `/order-confirmation/[id]`

### Image Upload (Admin)
1. Admin selects files on product form → `POST /api/upload` (FormData)
2. Server validates auth, file type, file size → converts to base64 → `cloudinary.uploader.upload()` → returns `secure_url`

## Key Design Patterns
- **SSR-first monolith** — SvelteKit handles everything (frontend, API, admin). No separate backend service.
- **Form actions** — All mutations use SvelteKit form actions with `use:enhance` for progressive enhancement and built-in CSRF protection.
- **REST API** — Cart and upload use JSON API endpoints (`/api/*`) for client-side fetch operations.
- **Lazy initialization** — Both Prisma and Cloudinary use deferred initialization patterns because Hostinger's env vars aren't available at module import time.

## External Dependencies
| Service     | What it does                        | What breaks if down                    |
|-------------|-------------------------------------|----------------------------------------|
| MariaDB     | All data storage                    | Entire site — every page needs DB      |
| Cloudinary  | Image hosting/CDN                   | Product images won't load, uploads fail |
| Hostinger   | Hosting, SSL, DNS                   | Site completely offline                |
| Razorpay    | Payment processing (NOT YET ACTIVE) | N/A — not integrated yet               |
| NimbusPost  | Shipping rates/labels (NOT YET)     | N/A — not integrated yet               |

## Scalability & Limits
- **Single Node.js instance** — Hostinger shared hosting runs one process. No horizontal scaling.
- **In-memory rate limiter** — Resets on restart, single-instance only. Would need Redis for multi-instance.
- **Cloudinary free tier** — 25 credits/month. May need paid plan if product catalog grows significantly.
- **MariaDB shared** — No connection pooling control. Prisma manages connections internally.

## What NOT to Do
- **Do NOT use Prisma's Rust engine** — will crash on Hostinger. Always use JS adapter.
- **Do NOT use `$env/static/private`** for runtime secrets — use `$env/dynamic/private`.
- **Do NOT call `cloudinary.config()` at module level** — use the lazy getter.
- **Do NOT create anonymous/guest carts** — DB flooding risk. Auth required.
- **Do NOT trust client-sent prices or discounts** — always recalculate server-side.
- **Do NOT remove admin auth checks from form actions** — defense-in-depth, not redundancy.
