# Deployment — Hostinger Shared Hosting

## Environment
- **Platform**: Hostinger Shared Hosting (Business plan)
- **Server**: Node.js 18 behind Nginx reverse proxy
- **Domain**: bunbunclothing.store (SSL via Hostinger)
- **Database**: MariaDB on `auth-db1953.hstgr.io:3306`
- **Git Deployment**: GitHub → Hostinger auto-deploy on push to `master`

## Environment Variables (Hostinger Panel)
Set these in: hPanel → Websites → Advanced → Node.js → Environment Variables

### Currently SET on Hostinger ✅
| Variable | Value |
|----------|-------|
| `MYSQL_HOST` | `auth-db1953.hstgr.io` |
| `MYSQL_USER` | `u451828854_bunbun` |
| `MYSQL_PASSWORD` | `Bokochiko@0211` |
| `MYSQL_DATABASE` | `u451828854_bunbun` |
| `MYSQL_PORT` | `3306` |
| `CLOUDINARY_API_KEY` | `837275897467999` |
| `CLOUDINARY_API_SECRET` | `20jeuOeW0gthELPm8ghoJGv5b2w` |
| `CLOUDINARY_CLOUD_NAME` | `dusd6xfyx` |

### Optional (not currently used by code)
| Variable | Notes |
|----------|-------|
| `AUTH_SECRET` | Not imported anywhere — Lucia generates its own session IDs |
| `DATABASE_URL` | Not used — `db.ts` reads `MYSQL_*` vars directly |
| `PUBLIC_APP_URL` | Not imported anywhere in current code |
| `RAZORPAY_KEY_ID` | Needed later when Razorpay payment goes live |
| `RAZORPAY_KEY_SECRET` | Needed later when Razorpay payment goes live |
| `NIMBUSPOST_API_KEY` | Needed later when NimbusPost shipping goes live |

## Build Process
The `package.json` `postinstall` script runs:
```
node hostinger.cjs && npx prisma generate && vite build
```

`hostinger.cjs` patches the build to work within Hostinger's constraints.

## Known Issues

### 504 Gateway Timeout on Deploy
- **What**: Site shows 504 for 1-3 minutes after every deploy
- **Why**: Hostinger kills the old Node.js process, runs build, then starts new one
- **Fix**: Just wait — it resolves automatically. This is expected behavior.

### Prisma Engine Panic
- **What**: `PANIC: timer has gone away` on startup
- **Why**: Hostinger's LVE container blocks Rust's `tokio` timer syscalls
- **Fix**: Use JavaScript adapter (`@prisma/adapter-mariadb`) with Proxy-based lazy init in `db.ts`
- **NEVER** revert to `engineType = "binary"` or direct Prisma engine

### Cloudinary Module Crash
- **What**: `Internal Error` on image upload
- **Why**: Cloudinary env vars not available at module import time on Hostinger
- **Fix**: Use lazy getter function `getCloudinary()` instead of module-level `cloudinary.config()`

## Deploy Checklist
1. `git push` to `master` branch
2. Go to Hostinger hPanel → Git → Redeploy (or auto-deploys)
3. Wait 2-3 minutes for 504 to clear
4. Verify at `https://bunbunclothing.store/api/health`
5. Test critical flows: homepage, product page, login, cart, checkout
