# BunBunClothing — Application Shell Specification

This document defines the persistent navigation and layout structure for BunBunClothing.

---

## Shell Pattern: Top Navigation (Ecommerce Standard)

For an ecommerce storefront, we use **Top Navigation** pattern — the industry standard for online shopping sites. This provides:
- Maximum content width for product grids
- Familiar shopping experience for customers
- Easy category browsing
- Prominent cart and account access

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ANNOUNCEMENT BAR (optional - for promotions)                   │
├─────────────────────────────────────────────────────────────────┤
│  HEADER                                                         │
│  ┌─────────┬───────────────────────────────────┬──────────────┐ │
│  │  LOGO   │      SEARCH BAR                   │  ICONS       │ │
│  │         │                                   │  👤 ❤️ 🛒     │ │
│  └─────────┴───────────────────────────────────┴──────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  NAVIGATION BAR                                                 │
│  [ Sarees ▼ ]  [ Blouses ]  [ Shapewear ]  [ Towels ]  [ More ] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       MAIN CONTENT                              │
│                     (Page-specific)                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
│  About | Contact | Policies | Social Links | Newsletter        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Announcement Bar (Optional)
Prominent banner for site-wide promotions.

**Contents:**
- Promotional text (e.g., "🎉 FLAT 50% OFF on All Sarees! Use code BUNBUN50")
- Optional close button
- Link to sale page

**Styling:**
- Background: `rose-500` (primary)
- Text: `white`
- Height: 40px
- Can be dismissed (stored in localStorage)

---

### 2. Header

**Desktop Layout (≥1024px):**
```
┌──────────────────────────────────────────────────────────────────────┐
│ [LOGO]          [________Search products..._______🔍]   👤  ❤️  🛒(2) │
└──────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (<1024px):**
```
┌──────────────────────────────────────────────┐
│  ☰   [LOGO]                       🔍  👤  🛒 │
└──────────────────────────────────────────────┘
```

**Elements:**

| Element | Desktop | Mobile | Action |
|---------|---------|--------|--------|
| **Logo** | Left, clickable | Center | → Homepage |
| **Search Bar** | Center, expanded | Icon only, opens overlay | → Search results |
| **Account Icon** | Right | Right | → Login/Account |
| **Wishlist Icon** | Right | Hidden (in menu) | → Wishlist |
| **Cart Icon** | Right, with badge | Right, with badge | → Cart (slide-out or page) |
| **Hamburger Menu** | Hidden | Left | → Mobile nav drawer |

**Styling:**
- Background: `white` (light) / `stone-900` (dark)
- Border bottom: `stone-200`
- Height: 64px desktop, 56px mobile
- Sticky on scroll

---

### 3. Navigation Bar (Desktop Only)

**Contents:**
```
[ Sarees ▼ ]  [ Blouses ]  [ Shapewear ]  [ Towels ]  [ Essentials ]  [ Sale 🔥 ]
```

**Mega Menu (on Sarees hover):**
```
┌─────────────────────────────────────────────────────────────────┐
│  BY FABRIC           BY OCCASION         BY STYLE              │
│  ─────────           ───────────         ────────              │
│  Silk Sarees         Wedding             Designer Sarees       │
│  Cotton Sarees       Party Wear          Ready to Wear         │
│  Georgette           Casual              Celebrity Collection  │
│  Chiffon             Festive             New Arrivals          │
│                                                                 │
│  [SHOP ALL SAREES →]                   [Featured Image]        │
└─────────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `stone-50`
- Text: `stone-700`, hover: `rose-600`
- Height: 48px
- Border bottom: `stone-200`

---

### 4. Mobile Navigation Drawer

Slides in from left on hamburger click.

```
┌──────────────────────────────┐
│  ✕  [LOGO]                   │
├──────────────────────────────┤
│  🔍 Search...                │
├──────────────────────────────┤
│  Sarees                    → │
│  Blouses                   → │
│  Shapewear                   │
│  Towels                      │
│  Essentials                  │
│  Sale 🔥                     │
├──────────────────────────────┤
│  My Account                  │
│  My Orders                   │
│  Wishlist                    │
│  Track Order                 │
├──────────────────────────────┤
│  Help & Support              │
│  Contact Us                  │
└──────────────────────────────┘
```

**Styling:**
- Width: 300px (or 80vw max)
- Background: `white`
- Overlay: `stone-900/50`
- Animation: Slide from left, 200ms

---

### 5. Footer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  [LOGO]                                                                 │
│  Your one-stop shop for                                                │
│  sarees, blouses & essentials                                          │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  SHOP              CUSTOMER SERVICE      POLICIES          FOLLOW US   │
│  ────              ────────────────      ────────          ─────────   │
│  Sarees            Contact Us            Privacy Policy    📘 Facebook │
│  Blouses           Track Order           Terms of Service  📷 Instagram│
│  Shapewear         Returns & Refunds     Return Policy     🐦 Twitter  │
│  Towels            FAQs                  Shipping Policy   📌 Pinterest│
│  Essentials        Size Guide                                          │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📧 SUBSCRIBE TO OUR NEWSLETTER                                        │
│  [_____Enter your email_____] [SUBSCRIBE]                              │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  💳 We Accept: Visa | Mastercard | UPI | Paytm | PhonePe | Razorpay    │
│                                                                         │
│  © 2026 BunBunClothing. All rights reserved.                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `stone-900`
- Text: `stone-300`, headings: `white`
- Links hover: `rose-400`
- Padding: 64px top/bottom

---

## Navigation Items

### Main Navigation (Customer)
| Item | Route | Dropdown |
|------|-------|----------|
| Sarees | `/collections/sarees` | Yes (mega menu) |
| Blouses | `/collections/blouses` | No |
| Shapewear | `/collections/shapewear` | No |
| Towels | `/collections/towels` | No |
| Essentials | `/collections/essentials` | No |
| Sale | `/collections/sale` | No |

### User Menu (Logged Out)
| Item | Route |
|------|-------|
| Login | `/login` |
| Register | `/register` |

### User Menu (Logged In)
| Item | Route |
|------|-------|
| My Account | `/account` |
| My Orders | `/account/orders` |
| My Wishlist | `/account/wishlist` |
| My Addresses | `/account/addresses` |
| Logout | `/logout` |

### Footer Links
| Section | Links |
|---------|-------|
| Shop | Sarees, Blouses, Shapewear, Towels, Essentials |
| Customer Service | Contact, Track Order, Returns, FAQs, Size Guide |
| Policies | Privacy, Terms, Return Policy, Shipping Policy |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | <640px | Hamburger menu, stacked elements |
| Tablet | 640-1023px | Hamburger menu, wider layout |
| Desktop | ≥1024px | Full nav bar, mega menus |
| Large | ≥1280px | Max content width 1280px |

---

## Cart Sidebar (Optional Enhancement)

Instead of navigating to `/cart`, show a slide-out cart drawer:

```
┌─────────────────────────────────┐
│  YOUR CART (2)              ✕   │
├─────────────────────────────────┤
│  ┌─────┐ Red Silk Saree         │
│  │ IMG │ Size: Free             │
│  └─────┘ ₹899  [-] 1 [+]  🗑️   │
│                                 │
│  ┌─────┐ Cotton Blouse          │
│  │ IMG │ Size: M                │
│  └─────┘ ₹499  [-] 2 [+]  🗑️   │
├─────────────────────────────────┤
│  Subtotal:              ₹1,897  │
│  Shipping:         Calculated   │
├─────────────────────────────────┤
│  [     VIEW CART      ]         │
│  [   CHECKOUT NOW     ]         │
└─────────────────────────────────┘
```

---

## Admin Shell (Separate)

The admin dashboard uses a **Sidebar Navigation** pattern:

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER: BunBunClothing Admin                    👤 Admin ▼  │
├───────────────────┬──────────────────────────────────────────┤
│  📊 Dashboard     │                                          │
│  📦 Products      │           MAIN CONTENT                   │
│  📁 Categories    │                                          │
│  🛒 Orders        │                                          │
│  👥 Customers     │                                          │
│  🎟️ Coupons       │                                          │
│  📢 Banners       │                                          │
│  📈 Reports       │                                          │
│  ⚙️ Settings      │                                          │
├───────────────────┴──────────────────────────────────────────┤
```

---

## Summary

| Component | Pattern | Sticky |
|-----------|---------|--------|
| Announcement Bar | Top banner | No |
| Header | Horizontal, full-width | Yes |
| Navigation Bar | Horizontal, mega menu | Yes (with header) |
| Mobile Nav | Drawer (left) | N/A |
| Footer | Multi-column | No |
| Cart | Sidebar drawer (optional) | N/A |
| Admin Shell | Sidebar navigation | Header sticky |
