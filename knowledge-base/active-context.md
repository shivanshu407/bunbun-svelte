# Active Context

## Current Status
**Last Updated**: 2026-05-08
**Last Agent Session**: Security audit remediation, knowledge-base creation, upload body size limit debugging

## In Progress
- [ ] Image upload — `BODY_SIZE_LIMIT=10M` needs to be added to Hostinger env panel (ISSUE-002)
- [ ] Razorpay payment integration — SDK installed but not wired up
- [ ] NimbusPost shipping integration — not started

## Blocked On
- Image uploads blocked by Hostinger's 512KB body size limit — requires adding `BODY_SIZE_LIMIT=10M` env var on Hostinger panel

## Decisions Needed
- What Razorpay mode to use first (test vs live)?
- Should the frontend show "Add to Cart" for guests with a login redirect, or hide the button entirely?

## Next Steps (for the next agent session)
1. Confirm `BODY_SIZE_LIMIT=10M` is set on Hostinger and image uploads work
2. Test full product creation flow end-to-end on production
3. Begin Razorpay payment integration (create order → checkout modal → verify signature)
4. Build NimbusPost shipping rate calculation service

## Do Not Touch
- `src/lib/server/db.ts` — Proxy-based lazy init pattern is critical for Hostinger. Do not simplify.
- `src/lib/server/cloudinary.ts` — Lazy getter pattern required. Do not revert to module-level config.
- `src/hooks.server.ts` — Contains rate limiting + security headers. Changes need careful review.
