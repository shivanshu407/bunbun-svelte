# BunBunClothing Store
> Full-stack e-commerce platform for women's clothing (sarees, blouses, shapewear, towels, essentials)

## Tech Stack
| Layer        | Technology                          |
|--------------|-------------------------------------|
| Language     | TypeScript                          |
| Framework    | SvelteKit 2 (adapter-node)          |
| Database     | MariaDB (via Prisma ORM + JS adapter) |
| Hosting      | Hostinger Shared (Node.js 18 + Nginx) |
| Auth         | Lucia v3 + bcryptjs                 |
| Image CDN    | Cloudinary (free tier)              |
| CSS          | Vanilla CSS with custom properties  |
| Payment      | Razorpay (SDK installed, NOT wired) |
| Shipping     | NimbusPost (NOT integrated yet)     |

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

## Critical Rules
- **NEVER** use Prisma's Rust engine — Hostinger's LVE container blocks `tokio` timer syscalls
- Prisma MUST use **Proxy-based lazy initialization** in `db.ts` with `@prisma/adapter-mariadb`
- Cloudinary MUST use **lazy getter function** `getCloudinary()` — not module-level config
- `razorpay.ts` currently uses `$env/static/private` — **must be refactored** before Razorpay goes live
- Always use `$env/dynamic/private` for runtime secrets (not `$env/static/private`)
- Deployments cause 1-3 min downtime (504 Gateway Timeout) while Node.js process restarts
- Admin access: manually set `role = 'admin'` via phpMyAdmin — no admin creation UI
- All admin form actions must include `locals.user.role !== 'admin'` check (defense-in-depth)
- Cart requires authentication — no anonymous/guest carts
- `BODY_SIZE_LIMIT=10M` must be set as env var on Hostinger for image uploads to work

## Quick Facts
| Key          | Value                                  |
|--------------|----------------------------------------|
| Repo         | github.com/shivanshu407/bunbun-svelte  |
| Staging URL  | N/A (no staging environment)           |
| Prod URL     | https://bunbunclothing.store           |
| DB           | MariaDB on `auth-db1953.hstgr.io`     |
| CI/CD        | GitHub → Hostinger auto-deploy on push to `master` |

## Reading Order
| File                    | When to Read                          |
|-------------------------|---------------------------------------|
| README.md               | Always first                          |
| decisions.md            | Before touching architecture          |
| known-issues.md         | Before debugging anything             |
| active-context.md       | Every session, to pick up where left  |
| changelog.md            | When tracing a regression or history  |
| architecture.md         | When working on data flow or schema   |
| deployment.md           | When deploying or debugging Hostinger |
| security.md             | When working on auth, API, or headers |
