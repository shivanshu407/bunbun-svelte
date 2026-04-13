# Security

## Audit Summary (2026-04-13)
Full security audit performed. All findings remediated.

## Active Protections

### Authentication & Sessions
- Passwords hashed with **bcryptjs** (cost factor 10)
- Session management via **Lucia v3** (httpOnly, secure cookies)
- Same error message for wrong email/wrong password (prevents user enumeration)
- Password minimum: **8 characters**
- Email format validated via regex on registration

### Rate Limiting
- **10 login/register attempts per 15 minutes** per IP address
- In-memory rate limiter in `hooks.server.ts`
- Returns 429 Too Many Requests when exceeded
- Stale entries auto-cleaned every 30 minutes

### Authorization
- Admin panel guarded at layout level (`/admin/+layout.server.ts`)
- All admin form actions independently verify `locals.user.role === 'admin'` (defense-in-depth)
- Upload endpoint (`/api/upload`) requires admin auth
- Cart mutations require authenticated user

### Input Validation
- Prisma ORM prevents SQL injection (parameterized queries)
- Email format regex on registration
- File upload: type whitelist (jpg/png/webp/avif), 5MB max size
- Order status: whitelist of valid values
- Payment method: whitelist of valid values
- Coupon discount: **always recalculated server-side** — never trusted from client

### IDOR Protections
- Cart item update/delete: verifies item belongs to user's cart
- Checkout address: scoped to `userId` in query
- Health endpoint: full diagnostics admin-only, public gets only ok/error

### Security Headers (all responses)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains (HTTPS only)
```

### CSRF Protection
- SvelteKit form actions have built-in CSRF (origin check)
- API endpoints use cookie-based session auth (no CSRF tokens needed for same-origin fetch)

## Secrets Management
- `.env` is in `.gitignore` — never committed
- Production secrets stored in Hostinger's env panel
- `AUTH_SECRET` must be a 128-char cryptographically random hex string
- Cloudinary credentials loaded dynamically at runtime

## Known Remaining Risks (Low Priority)
- No Content-Security-Policy header (complex to set correctly with SvelteKit inline styles)
- No account lockout after N failed attempts (rate limiting is the current mitigation)
- `razorpay.ts` uses `$env/static/private` — must refactor before going live with payments
