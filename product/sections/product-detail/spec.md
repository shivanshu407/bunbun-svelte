# Section: Product Detail Page

**Section ID:** `product-detail`  
**Route:** `/products/:slug`  
**Priority:** 🔴 Critical (Build First)

---

## Overview

The Product Detail Page (PDP) is where customers make purchase decisions. It displays all product information, images, variants, reviews, and enables adding to cart. This is the most conversion-critical page — design must build trust and reduce friction.

---

## User Stories

### As a customer, I want to:
- See high-quality product images from multiple angles
- Zoom in on product details
- Understand the product (fabric, care, sizing)
- Select my size and color
- Check if my pincode is serviceable
- Read customer reviews before buying
- Add the product to cart or wishlist
- See similar products for alternatives

### As a mobile user, I want to:
- Swipe through product images
- Easily tap to select sizes
- Have sticky "Add to Cart" button always visible

---

## Page Layout

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Sarees > Silk Sarees > Red Silk Patola Saree        │
├───────────────────────────────┬─────────────────────────────────────────┤
│                               │                                         │
│   ┌───────────────────────┐   │  RED SILK PATOLA SAREE                  │
│   │                       │   │  ⭐⭐⭐⭐⭐ 4.8 (256 reviews)            │
│   │                       │   │                                         │
│   │    MAIN PRODUCT       │   │  ₹899  ₹1,999  (-55% OFF)               │
│   │       IMAGE           │   │  Inclusive of all taxes                 │
│   │                       │   │                                         │
│   │     (with zoom)       │   │  ─────────────────────────────          │
│   │                       │   │                                         │
│   └───────────────────────┘   │  COLOR:  🔴 🟡 🟢 🔵                     │
│                               │                                         │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │  SIZE:  [Free Size] ✓  📏 Size Guide   │
│   │1 │ │2 │ │3 │ │4 │ │5 │   │                                         │
│   └──┘ └──┘ └──┘ └──┘ └──┘   │  QUANTITY:  [-] 1 [+]                   │
│   (thumbnail gallery)         │                                         │
│                               │  ─────────────────────────────          │
│                               │                                         │
│                               │  📍 Check Delivery: [______] [CHECK]   │
│                               │  ✅ Delivery by Feb 15 - Free Shipping  │
│                               │                                         │
│                               │  ─────────────────────────────          │
│                               │                                         │
│                               │  [🛒 ADD TO CART]  [❤️ WISHLIST]        │
│                               │  [⚡ BUY NOW]                           │
│                               │                                         │
├───────────────────────────────┴─────────────────────────────────────────┤
│                                                                         │
│  [DESCRIPTION] [SPECIFICATIONS] [CARE] [REVIEWS (256)]                  │
│  ─────────────────────────────────────────────────────                  │
│                                                                         │
│  This beautiful handcrafted Patola saree features intricate...          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  YOU MAY ALSO LIKE                                                      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                       │
│  │     │ │     │ │     │ │     │                                       │
│  └─────┘ └─────┘ └─────┘ └─────┘                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  RECENTLY VIEWED                                                        │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                       │
│  │     │ │     │ │     │ │     │                                       │
│  └─────┘ └─────┘ └─────┘ └─────┘                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile (<1024px)
```
┌─────────────────────────────────┐
│  ← Back                    ❤️ 🔗 │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    PRODUCT IMAGE          │  │
│  │    (swipeable carousel)   │  │
│  │                           │  │
│  │           ● ○ ○ ○ ○       │  │
│  └───────────────────────────┘  │
│                                 │
│  Red Silk Patola Saree          │
│  ⭐ 4.8 (256 reviews) >         │
│                                 │
│  ₹899  ₹1,999  -55%             │
│                                 │
│  COLOR:  🔴 🟡 🟢 🔵             │
│  SIZE:   [Free Size] ✓          │
│                                 │
│  📍 Check Delivery              │
│  [Enter pincode] [CHECK]        │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  PRODUCT DETAILS >              │
│  SPECIFICATIONS >               │
│  REVIEWS (256) >                │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  SIMILAR PRODUCTS               │
│  [horizontal scroll]            │
│                                 │
├─────────────────────────────────┤
│  [🛒 ADD TO CART ₹899]  [BUY]   │  ← Sticky bottom bar
└─────────────────────────────────┘
```

---

## Components

### 1. Breadcrumb
`Home > Category > Subcategory > Product Name`

---

### 2. Image Gallery

**Desktop:**
- Main image: 600x750px area
- Thumbnail strip below (5-6 thumbnails)
- Click thumbnail to change main image
- Hover/click main image to zoom (lightbox or inline zoom)
- Video support for product videos

**Mobile:**
- Full-width swipeable carousel
- Dot indicators
- Tap to open fullscreen gallery
- Pinch to zoom

**Image Requirements:**
| Type | Size | Format |
|------|------|--------|
| Main | 800x1000px | WebP |
| Thumbnail | 100x125px | WebP |
| Zoom | 1600x2000px | WebP |

---

### 3. Product Info Section

| Element | Description |
|---------|-------------|
| **Title** | Product name (H1) |
| **Rating** | Stars + average + review count (clickable → scroll to reviews) |
| **Price** | Sale price (prominent), original price (strikethrough) |
| **Discount** | Percentage off badge |
| **Tax note** | "Inclusive of all taxes" |

---

### 4. Variant Selectors

**Color Selector:**
```
COLOR: Red
🔴 🟡 🟢 🔵 ⚫ ⚪
(selected has border/ring)
```

**Size Selector:**
```
SIZE:                    📏 Size Guide
[S] [M] [L] [XL] [Free Size ✓]
(out of stock sizes grayed with strikethrough)
```

**Size Guide Modal:**
- Opens modal/drawer with size chart
- Measurements in inches/cm
- How to measure instructions

---

### 5. Quantity Selector
```
QUANTITY: [-] 1 [+]
```
- Min: 1
- Max: Stock available or 10 (whichever is lower)

---

### 6. Pincode Checker

```
📍 Check Delivery
[______] [CHECK]

✅ Delivery by Feb 15, 2026
   Free Shipping (orders above ₹999)
   
⚠️ Cash on Delivery available
```

**States:**
| State | Message |
|-------|---------|
| Not entered | "Enter pincode to check delivery" |
| Valid | "Delivery by [date]" + shipping info |
| Invalid | "Delivery not available to this pincode" |
| COD available | "Cash on Delivery available" |

---

### 7. Action Buttons

| Button | Action | Style |
|--------|--------|-------|
| **Add to Cart** | Add product with selected variant | Primary (rose-500) |
| **Buy Now** | Add to cart + redirect to checkout | Secondary (outline) |
| **Wishlist** | Add/remove from wishlist | Icon button (heart) |
| **Share** | Open share sheet | Icon button |

**Add to Cart Flow:**
1. Validate size selected (if required)
2. Add to cart
3. Show success toast: "Added to cart!"
4. Update cart badge count
5. Optional: Show mini cart drawer

---

### 8. Offers & Deals Section

**Position:** Below Action Buttons, prominently visible

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏷️ AVAILABLE OFFERS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💳 Bank Offers                                                 │
│  • 10% Instant Discount on HDFC Bank Cards (Max ₹200)          │
│  • 5% Cashback on Paytm Wallet                                  │
│  • No Cost EMI on orders above ₹3000                            │
│                                                                 │
│  🎟️ Coupons                                                     │
│  • Use code BUNBUN10 for 10% off on first order                │
│  • Use code SILK20 for ₹200 off on Silk Sarees          [COPY] │
│  • Use code FESTIVE for extra 15% off (min ₹1500)       [COPY] │
│                                                                 │
│  🎁 Combo Offers                                                │
│  • Buy 2 Get 10% Off on Blouses                                │
│  • Free Shapewear on orders above ₹2500                        │
│                                                                 │
│  📦 Delivery Offers                                             │
│  • Free Shipping on orders above ₹999                          │
│  • Express Delivery available at ₹99                            │
│                                                                 │
│  [View All Offers ▼]                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Offer Types:**

| Type | Icon | Examples |
|------|------|----------|
| **Bank Offers** | 💳 | Instant discounts on specific bank cards, cashback, EMI |
| **Coupons** | 🎟️ | Promo codes with "COPY" button |
| **Combo/Bundle** | 🎁 | Buy more save more, free item offers |
| **Delivery** | 📦 | Free shipping thresholds, express options |
| **Special** | ⭐ | Festival sales, flash deals, member-only |

**Features:**
- Collapsible (show 3 offers, expand for more)
- "COPY" button for coupon codes → copies to clipboard, shows "Copied!" toast
- Highlight most valuable offer
- Show validity/expiry if applicable
- Link to T&C for each offer

**Mobile Layout:**
- Same content, full-width cards
- Horizontally scrollable offer chips OR accordion

**Data Source:**
- Global offers from Coupon entity
- Product-specific offers (if any)
- Category-specific offers
- Bank partner offers (static or API)

---

### 9. Product Details Accordion/Tabs

**Sections:**

| Tab | Content |
|-----|---------|
| **Description** | Product description, features, highlights |
| **Specifications** | Fabric, length, width, weight, color, pattern |
| **Care Instructions** | Washing, drying, ironing instructions |
| **Shipping & Returns** | Shipping times, return policy |

**Mobile:** Collapsible accordions
**Desktop:** Tabs or accordions

---

### 10. Customer Reviews Section

**Summary:**
```
CUSTOMER REVIEWS
⭐⭐⭐⭐⭐ 4.8 out of 5
Based on 256 reviews

5 ★ ████████████████░░ 85%
4 ★ ███░░░░░░░░░░░░░░░ 10%
3 ★ █░░░░░░░░░░░░░░░░░  3%
2 ★ ░░░░░░░░░░░░░░░░░░  1%
1 ★ ░░░░░░░░░░░░░░░░░░  1%

[WRITE A REVIEW]
```

**Review Card:**
```
┌─────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐  Beautiful saree!            │
│  Priya S. • Verified Purchase • Feb 5  │
│                                         │
│  The saree is exactly as shown. Fabric  │
│  quality is amazing and the color is... │
│  [Read more]                            │
│                                         │
│  📷 [img] [img] [img]                   │
│                                         │
│  👍 12 people found this helpful        │
└─────────────────────────────────────────┘
```

**Features:**
- Sort by: Most recent, Most helpful, Highest rated
- Filter by: Rating, With photos, Verified only
- Load more / pagination
- Photo gallery from reviews

---

### 11. Related Products

**"You May Also Like"**
- 4 products on desktop
- Horizontal scroll on mobile
- Based on: Same category, similar price, frequently bought together

**"Recently Viewed"**
- Products user has viewed before
- Stored in localStorage
- Max 8 items

---

## Data Requirements

| Data | Source |
|------|--------|
| Product | Product entity with all details |
| Images | Product images array |
| Variants | Size/color combinations with stock |
| Reviews | Review entity, paginated |
| Related | Product entity, filtered by category |
| Recently viewed | localStorage |

---

## Validation Rules

| Field | Rule | Error |
|-------|------|-------|
| Size | Required if product has sizes | "Please select a size" |
| Color | Required if multiple colors | "Please select a color" |
| Pincode | 6 digits | "Enter valid 6-digit pincode" |

---

## Error States

| Scenario | Display |
|----------|---------|
| Product not found | 404 page |
| Out of stock (all variants) | "Out of Stock" badge, disable Add to Cart |
| Variant out of stock | Gray out variant, show "Out of Stock" |
| Image load error | Show placeholder image |

---

## SEO Requirements

- **Title:** "[Product Name] | Buy Online at BunBunClothing"
- **Meta Description:** "[Product name]. [Price]. [Key features]. Free shipping over ₹999. Easy returns."
- **H1:** Product name
- **Structured Data:** Product schema with price, availability, rating, reviews

**Product Schema:**
```json
{
  "@type": "Product",
  "name": "Red Silk Patola Saree",
  "image": ["url1", "url2"],
  "description": "...",
  "sku": "SKU123",
  "offers": {
    "@type": "Offer",
    "price": "899",
    "priceCurrency": "INR",
    "availability": "InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "256"
  }
}
```

---

## Performance Requirements

- LCP (main image): < 2s
- Image lazy loading: Below-fold images, thumbnails
- Review pagination: Load first 5, then load more
- Skeleton loaders during data fetch

---

## Mobile-Specific Requirements

- Sticky bottom bar with "Add to Cart" + price
- Swipeable image carousel
- Collapsible sections for specs/reviews
- Tap-to-zoom images
- Easy size selection (large tap targets)

---

## Success Metrics

- Add to Cart rate: > 10%
- Wishlist add rate: > 5%
- Review engagement: > 20% scroll to reviews
- Size guide usage: Track opens
- Bounce rate: < 50%
