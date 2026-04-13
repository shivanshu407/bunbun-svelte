# BunBunClothing Knowledge Base

## Project Overview
**Name**: BunBunClothing Store  
**Domain**: https://bunbunclothing.store/  
**Tech Stack**: SvelteKit, Prisma ORM, MariaDB (MySQL), Cloudinary, Lucia Auth  
**Hosting**: Hostinger Shared Hosting (Node.js + Nginx)  

## Directory Structure
- `src/routes/` — SvelteKit pages and API routes
- `src/lib/server/` — Server-only modules (db, auth, cloudinary, razorpay)
- `src/lib/components/` — Reusable Svelte UI components
- `src/lib/stores/` — Svelte stores (cart, coupon)
- `prisma/schema.prisma` — Database schema

## Reading Order
| File | Description |
|------|-------------|
| README.md | This file — project overview |
| changelog.md | Chronological change history |

## Critical Rules
- Prisma uses **Proxy-based lazy initialization** in `db.ts` due to Hostinger's restricted LVE container
- Cloudinary also uses **lazy getter function** (`getCloudinary()`) for the same reason
- Never use `$env/static/private` for keys needed at runtime — always `$env/dynamic/private`
- The `razorpay.ts` uses `$env/static/private` (needs fixing when integrating)
- Admin access requires manually promoting a user's `role` to `'admin'` via phpMyAdmin

## Quick Facts
| Item | Value |
|------|-------|
| Domain | bunbunclothing.store |
| Hosting | Hostinger Shared (Node.js) |
| Database | MariaDB on Hostinger |
| Image CDN | Cloudinary (free tier) |
| Auth | Lucia v3 + bcryptjs |
| Repo | github.com/shivanshu407/bunbun-svelte |
