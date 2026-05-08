# Decisions

## Decision: Prisma JavaScript Adapter over Rust Engine
**Date**: 2026-04-06
**Status**: Accepted
**Context**: Hostinger's shared hosting uses LVE containers that block Rust's `tokio` timer system calls. Prisma's default Rust query engine crashed with `PANIC: timer has gone away` on every request.
**Decision**: Use `@prisma/adapter-mariadb` (JavaScript adapter) with a Proxy-based lazy initialization pattern in `db.ts`.
**Alternatives Considered**: 
- `engineType = "binary"` — still crashed under LVE restrictions
- Switch to a different ORM (Drizzle, Knex) — too much rewrite effort
- Switch hosting provider — unnecessary cost
**Consequences**: Slightly slower queries (JS vs Rust), but completely stable on Hostinger. All Prisma features still available.

## Decision: Cloudinary Lazy Getter Pattern
**Date**: 2026-04-13
**Status**: Accepted
**Context**: Cloudinary's SDK `config()` call at module import time failed on Hostinger because env vars weren't populated yet during the module loading phase.
**Decision**: Export a `getCloudinary()` function that lazily configures and returns the Cloudinary instance on first call.
**Alternatives Considered**:
- Module-level `cloudinary.config()` — crashed on Hostinger at import time
- Move to a different image service — unnecessary migration
**Consequences**: Every consumer must call `getCloudinary()` instead of importing a pre-configured instance. Easy pattern but must be remembered.

## Decision: Lucia v3 for Authentication
**Date**: 2026-02-10
**Status**: Accepted
**Context**: Needed session-based auth for an e-commerce store with admin and customer roles.
**Decision**: Use Lucia v3 with Prisma adapter, bcryptjs for password hashing (cost 10), cookie-based sessions.
**Alternatives Considered**:
- NextAuth/Auth.js — SvelteKit support was immature at the time
- JWT tokens — stateless but harder to revoke, less suitable for e-commerce
- Supabase Auth — added dependency on a third-party service
**Consequences**: Full control over auth flow. Manual session management. No magic — every endpoint must explicitly check `locals.user`.

## Decision: No Anonymous/Guest Carts
**Date**: 2026-04-13
**Status**: Accepted
**Context**: Guest cart creation (`prisma.cart.create({ data: {} })`) allowed unauthenticated users to flood the database with orphan cart records — a DoS vector (M4 from security audit).
**Decision**: Require authentication for all cart operations. No guest carts.
**Alternatives Considered**:
- Cookie-based guest cart with periodic cleanup — added complexity, cleanup cron not available on Hostinger
- localStorage cart with merge on login — significant frontend rewrite
**Consequences**: Users must log in before adding to cart. Slight UX friction, but eliminates the DB flooding risk entirely.

## Decision: Server-Side Coupon Recalculation
**Date**: 2026-04-13
**Status**: Accepted
**Context**: The checkout form was sending `couponDiscount` as a client-side form field. An attacker could modify it to get any order for ₹0 (C1 from security audit).
**Decision**: Server always recalculates coupon discount from the coupon code. Client-sent discount value is completely ignored.
**Alternatives Considered**: None — this is the only secure approach.
**Consequences**: Slightly more DB reads at checkout (re-fetch coupon), but eliminates the price manipulation attack vector.

## Decision: In-Memory Rate Limiting
**Date**: 2026-04-13
**Status**: Accepted
**Context**: No rate limiting existed on login/register endpoints, allowing unlimited brute-force attacks.
**Decision**: Simple in-memory `Map<ip, {count, resetAt}>` rate limiter in `hooks.server.ts`. 10 attempts per 15 minutes per IP.
**Alternatives Considered**:
- Redis-based rate limiting — Redis not available on Hostinger shared hosting
- External WAF/CDN rate limiting (Cloudflare) — not yet configured
**Consequences**: Rate limits reset on server restart. Single-instance only (fine for shared hosting). Will need Redis if scaling to multiple instances.
