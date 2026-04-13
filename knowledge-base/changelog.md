# Changelog

## 2026-04-13 — Full Security Audit & Vulnerability Remediation
**What**: Fixed 14 security vulnerabilities identified by comprehensive security audit
**Why**: Preparing for production launch with payment integration
**Files Changed**: 
- `src/routes/checkout/+page.server.ts`
- `src/routes/api/cart/+server.ts`
- `src/routes/api/health/+server.ts`
- `src/hooks.server.ts`
- `src/routes/admin/orders/+page.server.ts`
- `src/routes/admin/products/new/+page.server.ts`
- `src/routes/admin/banners/+page.server.ts`
- `src/routes/register/+page.server.ts`
**Commit**: `5cf4ef1`
- **C1 CRITICAL**: Server-side coupon discount recalculation — prevents ₹0 order exploit
- **C2 CRITICAL**: Cart item ownership verification — prevents cross-user IDOR
- **C3 CRITICAL**: Address lookup scoped to current user — prevents PII leak
- **H1 HIGH**: Health endpoint restricted to admin-only detailed diagnostics
- **H2 HIGH**: Rate limiting (10 attempts/15min) on login/register endpoints
- **H3 HIGH**: Admin auth checks added to all mutation form actions
- **H4 HIGH**: New cryptographic AUTH_SECRET generated (must update on Hostinger)
- **M2 MEDIUM**: Email format regex validation on registration
- **M3 MEDIUM**: Security headers added to all responses (HSTS, X-Frame-Options, etc.)
- **M4 MEDIUM**: Removed anonymous cart creation (prevents DB flooding)
- **L2 LOW**: Password minimum length increased from 6 to 8 characters

## 2026-04-13 — Cloudinary Lazy Initialization
**What**: Refactored Cloudinary config to use lazy getter function
**Why**: Module-level Cloudinary config was crashing on Hostinger due to env var timing issues
**Files Changed**: `src/lib/server/cloudinary.ts`, `src/routes/api/upload/+server.ts`, `src/routes/admin/banners/+page.server.ts`
**Commit**: `3091eca`
- Changed from `export default cloudinary` to `export default getCloudinary` (function)
- All consumers now call `getCloudinary().uploader.upload(...)` instead of `cloudinary.uploader.upload(...)`
- Same pattern as the Prisma proxy fix

## 2026-04-06 — Prisma Proxy-Based Lazy Initialization
**What**: Fixed production database connection failures on Hostinger
**Why**: Prisma's Rust query engine triggered PANIC errors due to Hostinger's restricted LVE container blocking timer system calls
**Files Changed**: `src/lib/server/db.ts`, `prisma/schema.prisma`
- Implemented JavaScript Proxy to defer PrismaClient creation until first database query
- Removed `engineType = "binary"` config in favor of JS adapter (PrismaMariaDb)
- Uses `mariadb` npm package directly via `@prisma/adapter-mariadb`
