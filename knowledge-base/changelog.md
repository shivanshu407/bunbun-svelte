# Changelog

## 2026-05-08 — Code Review Blocker Fixes (B1/B2/B3)
**What**: Fixed all 3 blockers from code review — missing admin auth guards, razorpay.ts crash risk, negative stock
**Why**: Admin actions on products/coupons/categories could be executed without authentication. Stock could go negative on concurrent orders.
**Impact**: All admin mutations now require verified admin role. Orders will fail gracefully if stock is insufficient. Razorpay is safe for future integration.
**Files Changed**: `src/routes/admin/products/+page.server.ts`, `src/routes/admin/coupons/+page.server.ts`, `src/routes/admin/categories/+page.server.ts`, `src/lib/server/razorpay.ts`, `src/routes/checkout/+page.server.ts`
**Commit**: `a5c70c4`

- B1: Added `if (!locals.user || locals.user.role !== 'admin') return fail(403)` to 8 actions: products (delete, toggleActive, toggleFeatured), coupons (create, toggle, delete), categories (create, delete)
- B2: Refactored razorpay.ts from `$env/static/private` + module-level init to `$env/dynamic/private` + lazy getter `getRazorpay()`
- B3: Added stock validation inside checkout transaction BEFORE order creation. Wrapped in try-catch to surface "Insufficient stock" errors as form errors instead of 500s

## 2026-05-08 — Code Review Suggestion Fixes (S1-S6)
**What**: Implemented all 6 suggestions from code review — input validation, collision resistance, error handling, cart limits, coupon abuse prevention, caching
**Why**: Hardening for production — preventing bad data, overselling, coupon abuse, and info leaks
**Impact**: Address fields now validated (10-digit phone, 6-digit pincode). Cart items capped at 10 per variant. Each coupon can only be used once per user. API errors no longer leak internal messages.
**Files Changed**: `src/lib/utils/index.ts`, `src/routes/checkout/+page.server.ts`, `src/routes/account/addresses/+page.server.ts`, `src/hooks.server.ts`, `src/routes/api/cart/+server.ts`, `src/lib/server/db.ts`
**Commit**: pending

- S1: Added shared `validateAddress()` function — validates name, phone (10 digits), pincode (6 digits), required fields
- S2: Switched `generateOrderNumber()` from `Math.random()` to `crypto.randomBytes()` for collision resistance
- S3: `handleError` no longer leaks raw error messages to API consumers — logs full error server-side
- S4: Cart quantity validated and capped at 10 per item on both POST (add) and PATCH (update)
- S5: Per-user coupon usage check — same coupon code can't be used twice by the same user
- S6: Prisma client cached on `globalThis` in all environments (was dev-only)

## 2026-04-14 — Upload Body Size Limit Fix
**What**: Discovered SvelteKit adapter-node enforces 512KB body limit via `BODY_SIZE_LIMIT` env var
**Why**: Product image uploads were failing with "Content-length exceeds limit" errors
**Impact**: Image uploads won't work until `BODY_SIZE_LIMIT=10M` is added to Hostinger env panel
**Files Changed**: `src/routes/api/upload/+server.ts`, `src/routes/admin/banners/+page.server.ts` (removed non-functional `config` export)
**Commit**: `39398f6`

- Removed incorrect `export const config = { body: { maxSize } }` — doesn't work with adapter-node
- Correct fix is `BODY_SIZE_LIMIT=10M` environment variable on Hostinger

## 2026-04-14 — Environment Variable Audit
**What**: Updated local `.env` and knowledge-base with correct Hostinger env var values
**Why**: DB host was wrong in docs (`srv2088` → `auth-db1953`), needed to verify which vars are actually used
**Impact**: None — documentation-only change
**Files Changed**: `.env`, `knowledge-base/README.md`, `knowledge-base/deployment.md`
**Commit**: `06b5c5f`

- Confirmed `AUTH_SECRET`, `DATABASE_URL`, `PUBLIC_APP_URL` are NOT used by the code
- The 8 env vars on Hostinger (5 MySQL + 3 Cloudinary) are sufficient

## 2026-04-13 — Full Security Audit & Remediation
**What**: Fixed 14 security vulnerabilities across Critical, High, and Medium severity
**Why**: Preparing for production launch with real customer orders and payment integration
**Impact**: Cart now requires login (no guest carts). Password minimum is 8 chars (was 6). Rate limiting on auth endpoints.
**Files Changed**: `src/routes/checkout/+page.server.ts`, `src/routes/api/cart/+server.ts`, `src/routes/api/health/+server.ts`, `src/hooks.server.ts`, `src/routes/admin/orders/+page.server.ts`, `src/routes/admin/products/new/+page.server.ts`, `src/routes/admin/banners/+page.server.ts`, `src/routes/register/+page.server.ts`
**Commit**: `5cf4ef1`

- C1: Server-side coupon discount recalculation (prevents ₹0 order exploit)
- C2: Cart item ownership verification (prevents cross-user IDOR)
- C3: Address lookup scoped to current user (prevents PII leak)
- H1: Health endpoint restricted to admin-only diagnostics
- H2: Rate limiting (10 attempts/15min) on login/register
- H3: Admin auth checks on all mutation actions
- M2: Email format regex validation
- M3: Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- M4: Removed anonymous cart creation
- L2: Password minimum 6 → 8 characters

## 2026-04-13 — Cloudinary Lazy Initialization
**What**: Refactored Cloudinary config to lazy getter function
**Why**: Module-level `cloudinary.config()` crashed on Hostinger due to env var timing
**Impact**: All Cloudinary consumers must use `getCloudinary()` instead of direct import
**Files Changed**: `src/lib/server/cloudinary.ts`, `src/routes/api/upload/+server.ts`, `src/routes/admin/banners/+page.server.ts`
**Commit**: `3091eca`

- Changed from `export default cloudinary` to `export default getCloudinary` (function)
- Same lazy-init pattern as the Prisma Proxy fix

## 2026-04-06 — Prisma Proxy-Based Lazy Initialization
**What**: Fixed production database connection crashes on Hostinger
**Why**: Prisma's Rust query engine triggered PANIC errors due to Hostinger's LVE container
**Impact**: Database works reliably on Hostinger. Slight perf hit (JS vs Rust engine).
**Files Changed**: `src/lib/server/db.ts`, `prisma/schema.prisma`
**Commit**: N/A

- Implemented JavaScript Proxy to defer PrismaClient creation until first query
- Switched to `@prisma/adapter-mariadb` (JavaScript adapter)
- Removed `engineType = "binary"` config
