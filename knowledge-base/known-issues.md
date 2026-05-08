# Known Issues

## ISSUE-001: 504 Gateway Timeout on Deploy
**Status**: Accepted Risk
**Severity**: Low
**Discovered**: 2026-04-06
**Symptom**: Site returns 504 Gateway Timeout for 1-3 minutes after every `git push` deploy.
**Root Cause**: Hostinger kills the old Node.js process, runs the build pipeline (`hostinger.cjs` → `prisma generate` → `vite build`), then starts the new process. During this window, Nginx has no backend to proxy to.
**Workaround**: Just wait 2-3 minutes. It resolves automatically.
**Fix**: N/A — inherent to Hostinger's shared hosting architecture. Would require a zero-downtime deployment strategy (e.g., blue-green) which is not available on this tier.

## ISSUE-002: Upload Body Size Limit (512KB Default)
**Status**: Open
**Severity**: High
**Discovered**: 2026-04-14
**Symptom**: Image uploads fail with `Content-length of X exceeds limit of 524288 bytes` error.
**Root Cause**: SvelteKit's `adapter-node` enforces a 512KB default body size limit via the `BODY_SIZE_LIMIT` environment variable.
**Workaround**: Add `BODY_SIZE_LIMIT=10M` to Hostinger's environment variables panel.
**Fix**: Must set env var on Hostinger. Code-level `export const config = { body: { maxSize } }` does NOT work with adapter-node.

## ISSUE-003: Prisma Rust Engine Panic
**Status**: Resolved
**Severity**: Critical
**Discovered**: 2026-04-06
**Resolved**: 2026-04-06
**Symptom**: `PANIC: timer has gone away` — every page load crashes with 500 error.
**Root Cause**: Hostinger's LVE container blocks Rust's `tokio` runtime timer syscalls. Prisma's Rust query engine cannot function.
**Fix**: Switched to `@prisma/adapter-mariadb` (JavaScript adapter) with Proxy-based lazy initialization in `db.ts`. See `decisions.md` → "Prisma JavaScript Adapter over Rust Engine".

## ISSUE-004: Cloudinary Module-Level Crash
**Status**: Resolved
**Severity**: Critical
**Discovered**: 2026-04-13
**Resolved**: 2026-04-13
**Symptom**: Image upload returns `Internal Error` — Cloudinary SDK fails silently at import time.
**Root Cause**: `cloudinary.config()` was called at module import time, before Hostinger had populated environment variables.
**Fix**: Refactored to lazy getter function `getCloudinary()`. See `decisions.md` → "Cloudinary Lazy Getter Pattern".

## ISSUE-005: Price Manipulation via Client-Sent Coupon Discount
**Status**: Resolved
**Severity**: Critical
**Discovered**: 2026-04-13
**Resolved**: 2026-04-13
**Symptom**: Attacker could place orders for ₹0 by modifying the `couponDiscount` form field.
**Root Cause**: Server trusted client-sent `couponDiscount` value without recalculating.
**Fix**: Server now recalculates coupon discount from the coupon code. Client value ignored entirely.
