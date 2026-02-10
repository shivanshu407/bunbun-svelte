# BunBunClothing — Developer Handoff Package (SvelteKit)

**Generated:** February 10, 2026  
**Version:** 1.0 (SvelteKit)  
**Status:** Ready for Development

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Data Model](#4-data-model)
5. [Application Shell](#5-application-shell)
6. [Section Specifications](#6-section-specifications)
7. [API Endpoints](#7-api-endpoints)
8. [Development Phases](#8-development-phases)
9. [File References](#9-file-references)

---

## 1. Project Overview

### About
**BunBunClothing** is a B2C ecommerce platform for women's ethnic clothing and essentials, targeting customers in India.

### Product Categories
- Sarees (Silk, Cotton, Designer)
- Blouses (Ready-made, Designer)
- Shapewear
- Towels
- Essentials

### Key Features
| Customer | Admin |
|----------|-------|
| Product catalog with filters | Product management |
| User accounts & wishlist | Order management |
| Shopping cart & checkout | Customer management |
| Razorpay payments (UPI, Cards, NetBanking) | Coupon/banner management |
| Order tracking | Reports & analytics |

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | SvelteKit 2 (adapter-node) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | MySQL |
| **ORM** | Prisma |
| **Auth** | Lucia Auth v3 |
| **Payments** | Razorpay Checkout.js |
| **Icons** | lucide-svelte |
| **Forms** | sveltekit-superforms + Zod |
| **Dev Database** | Railway (MySQL) |
| **Production** | Hostinger VPS + PM2 + Nginx |

📄 **Full config:** `product/tech-stack.md`

---

## 3. Design System

### Colors
```css
--rose-500: #F43F5E;    /* Primary / CTAs */
--rose-600: #E11D48;    /* Hover */
--amber-500: #F59E0B;   /* Sales / urgency */
--stone-50: #FAFAF9;    /* Background */
--stone-900: #1C1917;   /* Text */
```

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Monospace:** JetBrains Mono (prices, codes)

---

## 4. Data Model

```
User ──┬── Order ──── OrderItem ──── Product
       ├── Cart ───── CartItem ───────┤
       ├── Wishlist ──────────────────┤
       ├── Address                    ├── ProductVariant
       └── Review ────────────────────┘

Category (hierarchical) | Coupon | Banner
```

📄 **Full schema:** `product/data-model/data-model.md`

---

## 5. Application Shell

```
+layout.svelte (root) → Header + Navigation + Footer
├── /                    → Homepage
├── /collections/*       → Product catalog
├── /products/[slug]     → Product detail
├── /cart                → Shopping cart
├── /checkout            → Checkout
├── /account/*           → User account
├── /login, /register    → Auth
└── /admin/* (+layout)   → Admin dashboard
```

📄 **Full spec:** `product/shell/spec.md`

---

## 6. Section Specifications

| Section | Route | Spec File |
|---------|-------|-----------|
| Homepage | `/` | `sections/homepage/spec.md` |
| Product Catalog | `/collections/*` | `sections/catalog/spec.md` |
| Product Detail | `/products/[slug]` | `sections/product-detail/spec.md` |
| Shopping Cart | `/cart` | `sections/cart/spec.md` |
| Checkout | `/checkout` | `sections/checkout/spec.md` |
| User Account | `/account/*` | `sections/account/spec.md` |
| Admin Dashboard | `/admin/*` | `sections/admin/spec.md` |

---

## 7. API Endpoints (SvelteKit)

### Form Actions (in +page.server.ts)
```
/cart          → addItem, removeItem, updateQuantity, applyCoupon
/checkout      → setAddress, placeOrder
/login         → login
/register      → register
/account       → updateProfile, changePassword
/admin/products → create, update, delete
/admin/orders   → updateStatus
/admin/coupons  → create, update, delete
```

### API Routes (in +server.ts)
```
/api/cart                        → GET cart
/api/payments/create-order       → POST create Razorpay order
/api/payments/verify             → POST verify payment
/api/webhooks/razorpay           → POST webhook
```

---

## 8. Development Phases

### Phase 1: Setup & Core — 4-5 weeks
- [ ] SvelteKit project + Tailwind + Prisma + Lucia
- [ ] Database schema + seed data
- [ ] Design system + root layout (shell)
- [ ] Homepage, Catalog, Product Detail
- [ ] Cart + Checkout + Razorpay

### Phase 2: Auth & Account — 2-3 weeks
- [ ] Login/Register with Lucia
- [ ] Account dashboard, orders, wishlist, addresses

### Phase 3: Admin — 2-3 weeks
- [ ] Admin layout + dashboard
- [ ] Product, order, coupon, banner management

### Phase 4: Polish & Launch — 1-2 weeks
- [ ] SEO, performance, mobile testing
- [ ] Deploy to Hostinger VPS

**Total: 9-13 weeks**

---

## 9. File References

| File | Description |
|------|-------------|
| `product/AI-PROMPT.md` | Ready-to-copy AI prompt |
| `product/tech-stack.md` | Full tech stack + deployment config |
| `product/product-overview.md` | Product vision |
| `product/product-roadmap.md` | Development roadmap |
| `product/data-model/data-model.md` | Database schema |
| `product/design-system/*.json` | Design tokens |
| `product/shell/spec.md` | Navigation layout |
| `product/sections/*/spec.md` | All 7 section specs |
| `product/sample-data/*` | Types + seed data |

---

**Happy Building with SvelteKit! 🚀**
