# BunBunClothing - Tech Stack (SvelteKit)

**Hosting:** Hostinger VPS  
**Finalized:** February 10, 2026

---

## Stack Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | SvelteKit | 2.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **Database** | MySQL | 8.x |
| **ORM** | Prisma | 5.x |
| **Auth** | Lucia Auth | 3.x |
| **Payments** | Razorpay Checkout | Latest |
| **Image Storage** | Cloudinary | - |
| **Process Manager** | PM2 | Latest |
| **Reverse Proxy** | Nginx | Latest |
| **Node Adapter** | @sveltejs/adapter-node | Latest |

---

## Why SvelteKit?

| Benefit | Detail |
|---------|--------|
| **Smaller bundles** | Svelte compiles to vanilla JS, no virtual DOM |
| **Faster performance** | Less client-side JS = faster page loads |
| **SSR + CSR** | Server-side rendering built in |
| **File-based routing** | `src/routes/` folder structure |
| **Form actions** | Built-in form handling (no API routes needed) |
| **Load functions** | Server-side data loading per page |

---

## Project Structure

```
bunbunclothing/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Base components (Button, Card, Input)
│   │   │   ├── layout/       # Header, Footer, Shell
│   │   │   ├── product/      # ProductCard, ProductGrid, etc.
│   │   │   └── cart/         # CartItem, CartSummary, etc.
│   │   ├── server/           # Server-only code
│   │   │   ├── db.ts         # Prisma client
│   │   │   ├── auth.ts       # Lucia auth setup
│   │   │   └── razorpay.ts   # Razorpay server config
│   │   ├── stores/           # Svelte stores
│   │   │   ├── cart.ts       # Cart state
│   │   │   └── user.ts       # User session state
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript types
│   ├── routes/
│   │   ├── +layout.svelte    # Root layout (shell)
│   │   ├── +layout.server.ts # Root data loader
│   │   ├── +page.svelte      # Homepage
│   │   ├── collections/
│   │   │   ├── +page.svelte              # All products
│   │   │   └── [category]/
│   │   │       └── +page.svelte          # Category page
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── +page.svelte          # Product detail
│   │   ├── cart/
│   │   │   └── +page.svelte              # Cart page
│   │   ├── checkout/
│   │   │   ├── +page.svelte              # Checkout
│   │   │   └── confirmation/[orderId]/
│   │   │       └── +page.svelte          # Order confirmation
│   │   ├── account/
│   │   │   ├── +page.svelte              # Dashboard
│   │   │   ├── orders/+page.svelte       # Order history
│   │   │   ├── wishlist/+page.svelte     # Wishlist
│   │   │   └── addresses/+page.svelte    # Addresses
│   │   ├── login/+page.svelte
│   │   ├── register/+page.svelte
│   │   ├── admin/
│   │   │   ├── +layout.svelte            # Admin shell
│   │   │   ├── +page.svelte              # Admin dashboard
│   │   │   ├── products/+page.svelte
│   │   │   ├── orders/+page.svelte
│   │   │   ├── customers/+page.svelte
│   │   │   ├── coupons/+page.svelte
│   │   │   └── banners/+page.svelte
│   │   └── api/
│   │       ├── cart/+server.ts           # Cart API
│   │       ├── payments/
│   │       │   ├── create-order/+server.ts
│   │       │   └── verify/+server.ts
│   │       └── webhooks/
│   │           └── razorpay/+server.ts
│   ├── app.html               # HTML template
│   ├── app.css                # Global styles + Tailwind
│   └── hooks.server.ts        # Auth hooks
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── static/                    # Static assets
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## SvelteKit Key Concepts

### Load Functions (Data Fetching)
```typescript
// src/routes/collections/[category]/+page.server.ts
import { prisma } from '$lib/server/db';

export async function load({ params, url }) {
  const products = await prisma.product.findMany({
    where: { category: { slug: params.category } },
    include: { images: true, variants: true }
  });
  return { products };
}
```

### Form Actions (Mutations)
```typescript
// src/routes/cart/+page.server.ts
export const actions = {
  addItem: async ({ request }) => {
    const data = await request.formData();
    // Add to cart logic
  },
  removeItem: async ({ request }) => {
    // Remove from cart logic
  },
  applyCoupon: async ({ request }) => {
    // Apply coupon logic
  }
};
```

### Svelte Stores (Client State)
```typescript
// src/lib/stores/cart.ts
import { writable } from 'svelte/store';

export const cart = writable({
  items: [],
  total: 0,
  itemCount: 0
});
```

### Auth Hook
```typescript
// src/hooks.server.ts
import { lucia } from '$lib/server/auth';

export const handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (sessionId) {
    const { session, user } = await lucia.validateSession(sessionId);
    event.locals.user = user;
    event.locals.session = session;
  }
  return resolve(event);
};
```

---

## Development Environment (Railway)

### Railway Setup
1. Go to [railway.app](https://railway.app)
2. Create new project → Add MySQL database
3. Copy the connection string

### Environment Variables (.env)
```env
# Railway MySQL
DATABASE_URL="mysql://root:xxxx@containers-us-west-xxx.railway.app:xxxx/railway"

# Lucia Auth
AUTH_SECRET="your-secret-key"

# Razorpay TEST mode
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="xxxxx"
PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"

# Cloudinary
CLOUDINARY_CLOUD_NAME="xxxxx"
CLOUDINARY_API_KEY="xxxxx"
CLOUDINARY_API_SECRET="xxxxx"

# App
PUBLIC_APP_URL="http://localhost:5173"
```

### Development Flow
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
# Opens at http://localhost:5173
```

---

## Production Environment (Hostinger VPS)

### Server Requirements
- Ubuntu 22.04 LTS
- Node.js 20.x LTS
- MySQL 8.x
- Nginx
- PM2

### SvelteKit Node Adapter
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true
    })
  }
};
```

### Build & Deploy
```bash
npm run build         # Creates /build folder
node build/index.js   # Runs production server on port 3000
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name bunbunclothing.com www.bunbunclothing.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bunbunclothing.com www.bunbunclothing.com;

    ssl_certificate /etc/letsencrypt/live/bunbunclothing.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bunbunclothing.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'bunbunclothing',
    script: 'build/index.js',
    cwd: '/var/www/bunbunclothing',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Deployment Commands
```bash
cd /var/www/bunbunclothing
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart bunbunclothing
```

---

## NPM Packages

### Core
```json
{
  "devDependencies": {
    "@sveltejs/adapter-node": "^2.0.0",
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^4.0.0",
    "svelte-check": "^3.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### Database & Auth
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "lucia": "^3.0.0",
    "@lucia-auth/adapter-prisma": "^4.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

### Styling & UI
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  },
  "dependencies": {
    "lucide-svelte": "^0.300.0",
    "clsx": "^2.0.0"
  }
}
```

### Payments & Utils
```json
{
  "dependencies": {
    "razorpay": "^2.9.0",
    "zod": "^3.22.0",
    "sveltekit-superforms": "^2.0.0",
    "cloudinary": "^1.41.0",
    "sharp": "^0.33.0"
  }
}
```

---

## Key Differences from Next.js

| Feature | Next.js | SvelteKit |
|---------|---------|-----------|
| Routing | `app/page.tsx` | `src/routes/+page.svelte` |
| Data loading | `async function` in page | `+page.server.ts` load function |
| API routes | `app/api/route.ts` | `src/routes/api/+server.ts` |
| Mutations | Server actions | Form actions |
| Auth | NextAuth.js | Lucia Auth |
| Client state | React Context/Zustand | Svelte stores |
| Components | `.tsx` (JSX) | `.svelte` (HTML-like) |
| Dev port | 3000 | 5173 |
| Build output | `.next/` | `build/` |
| Env prefix | `NEXT_PUBLIC_` | `PUBLIC_` |
