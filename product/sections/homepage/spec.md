# Section: Storefront Homepage

**Section ID:** `homepage`  
**Route:** `/`  
**Priority:** 🔴 Critical (Build First)

---

## Overview

The homepage is the primary landing page for BunBunClothing. It creates the first impression, showcases products, and drives customers to browse and purchase. The design should feel premium, feminine, and trustworthy — inspired by Sudathi.com.

---

## User Stories

### As a first-time visitor, I want to:
- Immediately understand what BunBunClothing sells
- See attractive product imagery that makes me want to browse
- Easily navigate to product categories
- See what's trending or on sale

### As a returning customer, I want to:
- Quickly find new arrivals
- See any ongoing promotions or discounts
- Access my account and previous orders
- Continue browsing where I left off

---

## Page Sections

### 1. Hero Section
**Purpose:** Capture attention, communicate brand identity, drive action

**Components:**
- Full-width hero image/carousel (auto-rotating, 5s interval)
- Headline text overlay (e.g., "Elegance Redefined")
- Subheadline (e.g., "Discover our new collection of silk sarees")
- Primary CTA button (e.g., "Shop Now")
- Secondary CTA (e.g., "View Collections")

**Requirements:**
- Minimum 2-3 hero slides for carousel
- Mobile: Stacked layout, image above text
- Desktop: Text overlay on image
- Lazy load images for performance

---

### 2. Category Quick Links
**Purpose:** Fast navigation to main product categories

**Layout:** Horizontal scrollable row (mobile) / Grid (desktop)

**Categories:**
| Image | Label | Link |
|-------|-------|------|
| 🖼️ | Sarees | `/collections/sarees` |
| 🖼️ | Blouses | `/collections/blouses` |
| 🖼️ | Shapewear | `/collections/shapewear` |
| 🖼️ | Towels | `/collections/towels` |
| 🖼️ | Essentials | `/collections/essentials` |

**Design:**
- Circular or rounded square images
- Category name below each image
- Hover: subtle scale + shadow
- Mobile: Horizontal scroll with snap

---

### 3. Trending Products
**Purpose:** Showcase popular items, create FOMO

**Heading:** "Trending Now 🔥"

**Layout:** 
- 4 products on desktop (grid)
- Horizontal scroll on mobile
- "View All" link to `/collections/trending`

**Product Card Data:**
- Product image (primary)
- Product name
- Original price (strikethrough if on sale)
- Sale price
- Discount badge (e.g., "-60%")
- Star rating + review count
- Quick "Add to Cart" button (optional)

---

### 4. Promotional Banner
**Purpose:** Highlight special offers, seasonal sales

**Layout:** Full-width banner with:
- Background image or gradient
- Promotional text (e.g., "FLAT 50% OFF on All Silk Sarees!")
- Coupon code (e.g., "Use code: BUNBUN50")
- CTA button (e.g., "Shop Sale")
- Countdown timer (optional, for flash sales)

---

### 5. Shop by Category (Featured Collections)
**Purpose:** Visual category navigation with lifestyle imagery

**Layout:** 2-3 column grid

**Example:**
| Image | Title | CTA |
|-------|-------|-----|
| Model in silk saree | Designer Sarees | Shop Now |
| Blouse closeup | Ready-Made Blouses | Shop Now |
| Shapewear flatlay | Saree Shapewear | Shop Now |

**Design:**
- Large lifestyle images
- Text overlay with category name
- Hover: image zoom effect

---

### 6. Bestseller Products
**Purpose:** Social proof, showcase top-selling items

**Heading:** "Bestsellers ⭐"

**Layout:** Same as Trending Products (4 items, scrollable on mobile)

**Link:** "View All" → `/collections/bestsellers`

---

### 7. New Arrivals
**Purpose:** Showcase fresh inventory, encourage repeat visits

**Heading:** "Just Arrived ✨"

**Layout:** Same as trending (4 items)

**Link:** "View All" → `/collections/new-arrivals`

---

### 8. Trust Indicators
**Purpose:** Build credibility, reduce purchase anxiety

**Layout:** Horizontal row of 4 icons with text

| Icon | Text |
|------|------|
| 🚚 | Free Shipping over ₹999 |
| 🔄 | Easy 7-Day Returns |
| 💳 | Secure Payments |
| ✅ | 100% Genuine Products |

---

### 9. Customer Reviews / Testimonials
**Purpose:** Social proof from real customers

**Heading:** "What Our Customers Say 💬"

**Layout:** Carousel of 3 testimonial cards

**Testimonial Card:**
- Customer photo (or avatar)
- Customer name
- Location (e.g., "Mumbai, Maharashtra")
- Star rating (5 stars)
- Review text (truncated to ~100 chars)
- Product purchased (optional)

---

### 10. Instagram Feed / Social Proof
**Purpose:** Show brand lifestyle, encourage social engagement

**Heading:** "Follow Us @bunbunclothing 📷"

**Layout:** Grid of 6 Instagram images (linked to posts or IG profile)

**Alternative:** User-generated content gallery

---

### 11. Newsletter Signup
**Purpose:** Capture emails for marketing

**Layout:** Full-width section with:
- Heading: "Join Our Family"
- Subtext: "Get 10% off your first order + exclusive deals"
- Email input field
- Subscribe button
- Privacy note: "We respect your privacy"

**Styling:**
- Background: Subtle pattern or gradient
- Accent color (rose-50 background, rose-500 button)

---

## Responsive Behavior

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero | Single image, stacked text | Full carousel | Full carousel |
| Categories | Horizontal scroll | 5-column grid | 5-column grid |
| Product grids | 2 columns, scroll | 3 columns | 4 columns |
| Promo banner | Stacked | Full-width | Full-width |
| Trust icons | 2x2 grid | 4-column row | 4-column row |
| Testimonials | Single card, swipe | 2 cards | 3 cards |

---

## Data Requirements

| Data | Source | Notes |
|------|--------|-------|
| Hero banners | Banner entity | Admin-managed |
| Trending products | Product entity | Filter: trending flag or sales velocity |
| Bestsellers | Product entity | Filter: high sales + high rating |
| New arrivals | Product entity | Sort: created date desc |
| Categories | Category entity | Top-level categories only |
| Testimonials | Review entity | Filter: approved, 5-star, featured |

---

## Performance Requirements

- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Image optimization:** WebP format, lazy loading below fold
- **Critical CSS:** Inline above-fold styles

---

## SEO Requirements

- **Title:** "BunBunClothing - Sarees, Blouses & Essentials | Shop Online"
- **Meta Description:** "Shop the latest sarees, designer blouses, shapewear & essentials at BunBunClothing. Free shipping over ₹999. Easy returns. 100% genuine products."
- **H1:** Single, descriptive heading in hero
- **Structured Data:** Organization, WebSite, Product (for featured items)

---

## Empty States

| Scenario | Fallback |
|----------|----------|
| No trending products | Hide section or show "Coming Soon" |
| No banners configured | Show default brand banner |
| No testimonials | Hide section |

---

## Interactions

| Element | Action | Result |
|---------|--------|--------|
| Hero CTA | Click | Navigate to collection |
| Category card | Click | Navigate to category page |
| Product card | Click | Navigate to product page |
| Add to Cart (quick) | Click | Add to cart, show confirmation toast |
| Wishlist icon | Click | Add to wishlist (if logged in) or prompt login |
| Newsletter form | Submit | Show success message, store email |

---

## Success Metrics

- Bounce rate < 40%
- Scroll depth > 60%
- Click-through to product pages > 15%
- Newsletter signup rate > 2%
- Time on page > 45 seconds
