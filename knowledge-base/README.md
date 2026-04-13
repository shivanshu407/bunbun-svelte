# BunBunClothing Knowledge Base

## Project Overview
**Name**: BunBunClothing Store  
**Description**: Full-stack e-commerce platform for women's clothing (sarees, blouses, shapewear, towels, essentials)  
**Domain**: https://bunbunclothing.store/  
**Tech Stack**: SvelteKit 2, Prisma ORM (MariaDB adapter), MariaDB/MySQL, Cloudinary, Lucia Auth v3, bcryptjs  
**Hosting**: Hostinger Shared Hosting (Node.js 18 + Nginx reverse proxy)  
**Repo**: github.com/shivanshu407/bunbun-svelte  

## Directory Structure
```
src/
├── hooks.server.ts          # Auth middleware, rate limiting, security headers
├── lib/
│   ├── server/
│   │   ├── auth.ts          # Lucia auth config + session management
│   │   ├── db.ts            # Prisma client (Proxy-based lazy init)
│   │   ├── cloudinary.ts    # Cloudinary config (lazy getter function)
│   │   └── razorpay.ts      # Razorpay SDK config (NOT YET ACTIVE)
│   ├── components/ui/       # Reusable Svelte components
│   ├── stores/              # Svelte stores (cart, coupon)
│   └── utils.ts             # Shared utilities (formatPrice, generateOrderNumber)
├── routes/
│   ├── (public pages)       # /, /products, /category, /cart, /login, /register
│   ├── account/             # User dashboard (orders, addresses, wishlist, profile)
│   ├── checkout/            # Checkout flow (address, payment, coupon, order)
│   ├── admin/               # Admin panel (products, orders, categories, banners, coupons, customers)
│   ├── api/                 # REST endpoints (cart, upload, health, auth, wishlist)
│   └── order-confirmation/  # Post-order confirmation page
prisma/
└── schema.prisma            # Database schema (User, Product, Order, Cart, etc.)
knowledge-base/              # Project documentation (this folder)
hostinger.cjs                # Hostinger deployment compatibility script
```

## Reading Order
| # | File | Description |
|---|------|-------------|
| 1 | `README.md` | This file — project overview, structure, critical rules |
| 2 | `changelog.md` | Chronological history of all changes |
| 3 | `deployment.md` | Hostinger deployment setup, env vars, known issues |
| 4 | `architecture.md` | Database schema, auth flow, API patterns |
| 5 | `security.md` | Security measures, audit results, hardening |

## Critical Rules

### Hostinger Compatibility
- **NEVER** use Prisma's Rust engine — Hostinger's LVE container blocks `tokio` timer syscalls
- Prisma MUST use **Proxy-based lazy initialization** in `db.ts` with `@prisma/adapter-mariadb`
- Cloudinary MUST use **lazy getter function** `getCloudinary()` — not module-level config
- `razorpay.ts` currently uses `$env/static/private` — **must be refactored** before Razorpay goes live
- Always use `$env/dynamic/private` for runtime secrets (not `$env/static/private`)
- Deployments cause 1-3 min downtime (504 Gateway Timeout) while Node.js process restarts

### Authentication
- Auth uses Lucia v3 with Prisma adapter
- Passwords hashed with bcryptjs (cost factor 10)
- Admin access: manually set `role = 'admin'` via phpMyAdmin — no admin creation UI
- Session cookies: `secure: true` in production, `httpOnly` by default via Lucia

### Conventions
- All form actions use SvelteKit's `use:enhance` for progressive enhancement
- All admin form actions must include `locals.user.role !== 'admin'` check (defense-in-depth)
- Cart requires authentication — no anonymous/guest carts
- Image uploads go through `/api/upload` → Cloudinary (`bunbun_products` folder)
- Prices are stored in INR as integers/floats (not paise)

## Quick Facts
| Item | Value |
|------|-------|
| Domain | bunbunclothing.store |
| Hosting | Hostinger Shared (Node.js 18) |
| Database | MariaDB on `srv2088.hstgr.io` |
| Image CDN | Cloudinary (free tier, cloud: `dusd6xfyx`) |
| Auth | Lucia v3 + bcryptjs |
| CSS | Vanilla CSS with custom properties |
| Payment | Razorpay (SDK installed, NOT wired up) |
| Shipping | NimbusPost (NOT integrated yet) |
| Repo | github.com/shivanshu407/bunbun-svelte |
| Node version | 18.x (Hostinger default) |
