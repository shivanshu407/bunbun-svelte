# Active Context

## Current Status
**Last Updated**: 2026-05-09
**Last Agent Session**: Migrated database from Hostinger MySQL to Supabase PostgreSQL — resolved persistent 503/504 errors

## In Progress
- [x] Phase 0: HomepageBlock DB model + Admin page (`/admin/homepage`)
- [x] Phase 1–15: Full mobile-first homepage redesign (all sections complete)
- [x] Categories fully dynamic (NavBar, MobileNav, pills, grids all from DB)
- [x] Category admin: image upload via Cloudinary + inline edit
- [x] **Database migration: MySQL → Supabase PostgreSQL**
- [x] **Production deploy — site is LIVE on bunbunclothing.store**

## Remaining Tasks
- [ ] Migrate image uploads from Cloudinary → Supabase Storage
- [ ] Upload actual category cover images via Admin → Categories
- [ ] Upload homepage block images via Admin → Homepage
- [ ] Razorpay payment integration
- [ ] NimbusPost shipping integration
- [ ] Seed initial product data into Supabase

## Blocked On
- Nothing currently blocked

## Decisions Needed
- Should "Sale" be a real category or a special promotional page?
- Razorpay mode: test vs live?

## Next Steps (for the next agent session)
1. Migrate Cloudinary → Supabase Storage for image uploads
2. Seed product/category data
3. Upload category images + homepage block images from admin panel
4. Begin Razorpay payment integration

## Do Not Touch
- `prisma/schema.prisma` — Recently migrated to PostgreSQL, all tables synced to Supabase
- `src/hooks.server.ts` — Contains rate limiting + security headers
- `src/lib/server/razorpay.ts` — Lazy getter pattern required
