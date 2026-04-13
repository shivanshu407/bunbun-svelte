# Deployment — Hostinger Shared Hosting

## Environment
- **Platform**: Hostinger Shared Hosting (Business plan)
- **Server**: Node.js 18 behind Nginx reverse proxy
- **Domain**: bunbunclothing.store (SSL via Hostinger)
- **Database**: MariaDB on `srv2088.hstgr.io:3306`
- **Git Deployment**: GitHub → Hostinger auto-deploy on push to `master`

## Environment Variables (Hostinger Panel)
Set these in: hPanel → Websites → Advanced → Node.js → Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MYSQL_HOST` | ✅ | `srv2088.hstgr.io` |
| `MYSQL_USER` | ✅ | Database username |
| `MYSQL_PASSWORD` | ✅ | Database password |
| `MYSQL_DATABASE` | ✅ | Database name |
| `MYSQL_PORT` | ✅ | `3306` |
| `DATABASE_URL` | ✅ | Full connection string for Prisma |
| `AUTH_SECRET` | ✅ | 128-char random hex string for sessions |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `PUBLIC_APP_URL` | ✅ | `https://bunbunclothing.store` |
| `RAZORPAY_KEY_ID` | ❌ | Not yet needed |
| `RAZORPAY_KEY_SECRET` | ❌ | Not yet needed |
| `PUBLIC_RAZORPAY_KEY_ID` | ❌ | Not yet needed |
| `NIMBUSPOST_API_KEY` | ❌ | Not yet needed |

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
