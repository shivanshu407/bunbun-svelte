# AI Handover Prompt for BunBunClothing (SvelteKit)

Copy and paste this entire prompt when starting a new AI session to build the project.

---

## THE PROMPT

```
I need you to build an ecommerce website called "BunBunClothing" - a B2C platform for women's ethnic clothing (sarees, blouses, shapewear, towels) targeting Indian customers.

## Project Context

I have complete planning documents in the `product/` folder. Read these files FIRST before writing any code:

1. `product/product-overview.md` - Product vision, features, target audience
2. `product/product-roadmap.md` - Development sections and priorities
3. `product/data-model/data-model.md` - Database entities and relationships
4. `product/design-system/colors.json` - Color palette (Rose primary, Amber secondary, Stone neutral)
5. `product/design-system/typography.json` - Fonts (Playfair Display headings, Inter body)
6. `product/shell/spec.md` - Navigation and layout structure
7. `product/sections/homepage/spec.md` - Homepage specification
8. `product/sections/catalog/spec.md` - Product catalog specification
9. `product/sections/product-detail/spec.md` - Product page specification
10. `product/sections/cart/spec.md` - Shopping cart specification
11. `product/sections/checkout/spec.md` - Checkout flow specification
12. `product/sections/account/spec.md` - User account specification
13. `product/sections/admin/spec.md` - Admin dashboard specification
14. `product/sample-data/types.ts` - TypeScript interfaces (adapt for Svelte)
15. `product/sample-data/*.json` - Sample data for seeding
16. `product/tech-stack.md` - Tech stack, project structure, and deployment config

## Tech Stack (MUST USE)

- **Framework:** SvelteKit 2 (with @sveltejs/adapter-node)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **ORM:** Prisma
- **Auth:** Lucia Auth v3 with @lucia-auth/adapter-prisma
- **Payments:** Razorpay Checkout.js
- **Forms:** sveltekit-superforms with Zod
- **Icons:** lucide-svelte
- **Hosting:** Hostinger VPS with PM2 + Nginx

## SvelteKit Architecture Rules

### File-based routing
- Pages go in `src/routes/`
- Components go in `src/lib/components/`
- Server-only code goes in `src/lib/server/`
- Shared stores go in `src/lib/stores/`

### Data Loading
- Use `+page.server.ts` with `load()` functions for all server data fetching
- Use `+page.ts` only for client-side-only data
- Never fetch data inside components directly, always pass as props from load functions

### Mutations / Form Handling
- Use SvelteKit form actions in `+page.server.ts` for all mutations (add to cart, checkout, login, etc.)
- Use sveltekit-superforms for form validation with Zod schemas
- Use `enhance` from `$app/forms` for progressive enhancement

### State Management
- Use Svelte stores (`writable`, `derived`) for client-side state (cart, user session)
- Keep cart state in a writable store synced with server
- Use `$lib/stores/` for all shared state

### Auth (Lucia)
- Set up Lucia in `src/lib/server/auth.ts`
- Use `hooks.server.ts` to validate sessions on every request
- Access user via `event.locals.user` in load functions and form actions
- Protect routes with auth guards in load functions

### Server-Side
- Prisma client in `src/lib/server/db.ts`
- Razorpay config in `src/lib/server/razorpay.ts`
- ALL database calls must happen in `+page.server.ts` or `+server.ts` files only

### Environment Variables
- Server-only: No prefix (e.g., `DATABASE_URL`, `RAZORPAY_KEY_SECRET`)
- Public (client): `PUBLIC_` prefix (e.g., `PUBLIC_RAZORPAY_KEY_ID`)

## Design Requirements

- **Colors:** Rose (#F43F5E) for primary, Amber (#F59E0B) for sales, Stone grays for neutral
- **Fonts:** Playfair Display (headings), Inter (body)
- **Style:** Premium, feminine, elegant - inspired by Sudathi.com
- **Mobile-first:** Responsive design with proper breakpoints
- **Animations:** Use Svelte transitions (`fade`, `slide`, `fly`) for smooth UI

## Development Order

Build in this exact sequence:

### Phase 1: Setup & Core
1. Initialize SvelteKit project: `npx sv create` with TypeScript + Tailwind
2. Install adapter-node, Prisma, Lucia, and other deps
3. Set up Prisma MySQL schema from data-model.md
4. Configure Lucia Auth with Prisma adapter
5. Create design system (Tailwind config with custom colors/fonts)
6. Build root layout (+layout.svelte) with header, footer, navigation
7. Seed database with sample data

### Phase 2: Customer Pages
8. Homepage (+page.svelte) with all sections from spec
9. Product catalog (/collections) with filters, sort, pagination
10. Product detail page (/products/[slug]) with variants, offers, reviews
11. Shopping cart (/cart) with Svelte store + coupon support
12. Checkout (/checkout) with Razorpay integration

### Phase 3: Auth & Account
13. Login/Register pages with Lucia Auth
14. User dashboard (/account)
15. Order history and tracking
16. Wishlist and saved addresses

### Phase 4: Admin
17. Admin layout (+layout.svelte with sidebar navigation)
18. Product management (CRUD with form actions)
19. Order management
20. Coupon and banner management

## Key Integration Details

### Razorpay
- Create Razorpay order in `+server.ts` API endpoint
- Load Razorpay Checkout.js script on client
- Use `PUBLIC_RAZORPAY_KEY_ID` env var for client-side key
- Verify payment signature in server-side `+server.ts`
- Implement webhook endpoint at `/api/webhooks/razorpay/+server.ts`

### Database
- Use Prisma with MySQL
- Follow schema from data-model.md exactly
- Seed with sample-data JSON files
- Use `prisma.$transaction()` for order creation

### Development Setup (Railway)
1. Go to railway.app and create a new project
2. Add MySQL database to the project
3. Copy the DATABASE_URL connection string
4. Create `.env` file with:
   ```
   DATABASE_URL="mysql://root:xxxx@containers-us-west-xxx.railway.app:xxxx/railway"
   AUTH_SECRET="your-secret-key"
   RAZORPAY_KEY_ID="rzp_test_xxxxx"
   RAZORPAY_KEY_SECRET="xxxxx"
   PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"
   PUBLIC_APP_URL="http://localhost:5173"
   ```

### Development commands:
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Then open http://localhost:5173 to test.

## Production (Hostinger VPS)
- Use @sveltejs/adapter-node to build for Node.js
- See tech-stack.md for Nginx and PM2 configuration
- Build command: `npm run build`
- Start command: `node build/index.js`

## Important Notes

- DO NOT skip any section from the specs
- Follow the exact component structure in each spec file
- Adapt TypeScript types from sample-data/types.ts for Svelte
- Use Svelte transitions for all modals, drawers, and interactive elements
- Use `{#each}`, `{#if}`, `{#await}` blocks — NOT JSX
- Make the design premium and visually stunning
- Test on mobile devices
- Use progressive enhancement (forms should work without JS)

## Start

First, read all the product/ files to understand the full scope. Then initialize the SvelteKit project and we'll build section by section.
```

---

## How to Use

1. Open a new AI session (Claude, ChatGPT, or another coding AI)
2. Set your workspace to `C:\Users\SHIVANSHU\Desktop\bunbun website`
3. Copy the prompt above and paste it
4. The AI will read your planning docs and start building

## Tips

- Build one section at a time
- Test each section before moving to next
- Keep the spec files open for reference
- Don't let the AI skip any features from the specs
- SvelteKit dev server runs on port **5173** (not 3000)
