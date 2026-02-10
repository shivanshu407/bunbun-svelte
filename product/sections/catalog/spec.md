# Section: Product Catalog & Categories

**Section ID:** `catalog`  
**Routes:** `/collections`, `/collections/:category`, `/search`  
**Priority:** 🔴 Critical (Build First)

---

## Overview

The product catalog is the core browsing experience where customers discover and explore products. It includes category pages, search results, filtering, and sorting. The design should make product discovery effortless and visually appealing.

---

## User Stories

### As a customer, I want to:
- Browse products by category (Sarees, Blouses, etc.)
- Filter products by price, size, color, and fabric
- Sort products by price, popularity, or newest
- See product cards with images, prices, and ratings
- Quickly add items to cart or wishlist
- Search for specific products

### As a returning customer, I want to:
- See "Recently Viewed" products
- Find products I previously looked at

---

## Page Types

### 1. Category Page (`/collections/:category`)
Displays all products within a specific category.

### 2. All Products Page (`/collections`)
Displays all products across categories.

### 3. Search Results Page (`/search?q=...`)
Displays products matching search query.

### 4. Filtered Results
Any of the above with active filters applied.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  BREADCRUMB: Home > Sarees > Silk Sarees                            │
├─────────────────────────────────────────────────────────────────────┤
│  CATEGORY HEADER                                                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [Category Banner Image]                                     │    │
│  │  SILK SAREES                                                 │    │
│  │  Discover our exquisite collection of silk sarees            │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  TOOLBAR                                                            │
│  [🔽 Filters]  Showing 1-24 of 156 products   [Sort: Popularity ▼]  │
├───────────────────┬─────────────────────────────────────────────────┤
│  FILTERS SIDEBAR  │  PRODUCT GRID                                   │
│                   │                                                 │
│  Price            │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  ○ Under ₹500     │  │     │ │     │ │     │ │     │               │
│  ○ ₹500 - ₹1000   │  │ IMG │ │ IMG │ │ IMG │ │ IMG │               │
│  ○ ₹1000 - ₹2000  │  │     │ │     │ │     │ │     │               │
│  ○ Above ₹2000    │  └─────┘ └─────┘ └─────┘ └─────┘               │
│                   │  Product  Product  Product  Product             │
│  Size             │  ₹899    ₹1,299   ₹799    ₹1,499               │
│  ☐ Free Size      │                                                 │
│  ☐ S              │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  ☐ M              │  │     │ │     │ │     │ │     │               │
│  ☐ L              │  │ IMG │ │ IMG │ │ IMG │ │ IMG │               │
│  ☐ XL             │  │     │ │     │ │     │ │     │               │
│                   │  └─────┘ └─────┘ └─────┘ └─────┘               │
│  Color            │                                                 │
│  🔴🟡🟢🔵⚫⚪      │                                                 │
│                   │                                                 │
│  Fabric           │                                                 │
│  ☐ Silk           │                                                 │
│  ☐ Cotton         │                                                 │
│  ☐ Georgette      │                                                 │
│                   │                                                 │
│  [Clear All]      │  [LOAD MORE] or Pagination: < 1 2 3 ... 10 >   │
├───────────────────┴─────────────────────────────────────────────────┤
```

---

## Components

### 1. Breadcrumb Navigation
Shows hierarchy: Home > Category > Subcategory

**Example:** `Home > Sarees > Silk Sarees`

---

### 2. Category Header (Optional)
Hero section for category pages.

**Components:**
- Category banner image
- Category title (H1)
- Category description
- Product count

**Hide for:** Search results, filtered views

---

### 3. Toolbar / Action Bar

**Desktop Layout:**
```
[🔽 Filters]  [Active filter chips: Size: M ✕ | Color: Red ✕]  156 products   [Sort: ▼]
```

**Mobile Layout:**
```
[🔽 Filters (3)]  [↕️ Sort]
```

**Sort Options:**
| Option | Value |
|--------|-------|
| Popularity | `popularity` (default) |
| Newest First | `newest` |
| Price: Low to High | `price_asc` |
| Price: High to Low | `price_desc` |
| Rating | `rating` |
| Discount | `discount` |

---

### 4. Filters Sidebar

**Desktop:** Always visible on left (width: 280px)
**Mobile:** Slide-out drawer from left

**Filter Groups:**

| Filter | Type | Options |
|--------|------|---------|
| **Price** | Radio/Range | Under ₹500, ₹500-₹1000, ₹1000-₹2000, Above ₹2000, Custom range |
| **Size** | Checkbox | Free Size, S, M, L, XL, XXL (varies by category) |
| **Color** | Color swatches | Red, Blue, Green, Yellow, Pink, Black, White, etc. |
| **Fabric** | Checkbox | Silk, Cotton, Georgette, Chiffon, etc. |
| **Availability** | Checkbox | In Stock, Include Out of Stock |
| **Discount** | Checkbox | 10% or more, 20% or more, 50% or more |

**Features:**
- Collapsible filter groups
- Active filter count on mobile toggle
- "Clear All" button
- Filter chips above grid for active filters

---

### 5. Product Grid

**Layout:**
| Screen | Columns | Gap |
|--------|---------|-----|
| Mobile (<640px) | 2 | 12px |
| Tablet (640-1023px) | 3 | 16px |
| Desktop (≥1024px) | 4 | 20px |

---

### 6. Product Card

```
┌───────────────────────────┐
│  ❤️                  -45% │  ← Wishlist + Discount badge
│  ┌─────────────────────┐  │
│  │                     │  │
│  │    PRODUCT IMAGE    │  │
│  │                     │  │
│  │   (hover: 2nd img)  │  │
│  └─────────────────────┘  │
│                           │
│  Red Silk Patola Saree    │  ← Product name (2 lines max)
│  ⭐ 4.5 (128)             │  ← Rating + review count
│  ₹899  ₹1,999             │  ← Sale price + original (strikethrough)
│                           │
│  [  ADD TO CART  ]        │  ← Quick add (optional)
└───────────────────────────┘
```

**Product Card Data:**
| Field | Required | Notes |
|-------|----------|-------|
| Primary Image | Yes | WebP, 400x500px |
| Secondary Image | Optional | Shown on hover |
| Product Name | Yes | Truncate to 2 lines |
| Price | Yes | Display sale price prominently |
| Original Price | If on sale | Strikethrough |
| Discount % | If on sale | Badge: "-45%" |
| Rating | If reviews exist | Stars + count |
| Wishlist Icon | Yes | Toggle add/remove |
| Out of Stock | If applicable | Overlay or badge |

**Interactions:**
- Hover: Show second image, subtle scale
- Click image/name: Go to product page
- Click wishlist: Add to wishlist (or prompt login)
- Click Add to Cart: Add to cart with default variant (or show size selector)

---

### 7. Pagination / Infinite Scroll

**Option A: Pagination**
```
< Previous  1  2  3  ...  10  Next >
```

**Option B: Load More Button**
```
[LOAD MORE PRODUCTS]
Showing 24 of 156 products
```

**Option C: Infinite Scroll**
- Auto-load next page on scroll
- Show skeleton loaders
- "Loading more..." indicator

**Recommendation:** Load More button (better for UX and SEO)

---

### 8. Empty State

When no products match filters:

```
┌─────────────────────────────────────┐
│           😕                        │
│                                     │
│   No products found                 │
│                                     │
│   Try adjusting your filters or     │
│   browse our popular categories     │
│                                     │
│   [Clear Filters]  [Browse All]     │
└─────────────────────────────────────┘
```

---

### 9. Search Results Page

**Heading:** `Search results for "silk saree"`

**Components:**
- Search query display
- Result count
- Product grid (same as category)
- "No results" state with suggestions

**No Results State:**
```
No results for "xyz"

Did you mean: silk saree, cotton saree?

Popular searches: Silk Sarees, Blouses, Shapewear
```

---

## URL Structure & Query Parameters

| Route | Example |
|-------|---------|
| All products | `/collections` |
| Category | `/collections/sarees` |
| Subcategory | `/collections/sarees/silk-sarees` |
| Search | `/search?q=red+silk` |
| Filtered | `/collections/sarees?price=500-1000&color=red&size=M` |
| Sorted | `/collections/sarees?sort=price_asc` |
| Paginated | `/collections/sarees?page=2` |

**Query Parameters:**
| Param | Type | Example |
|-------|------|---------|
| `q` | string | `q=silk+saree` |
| `price` | range | `price=500-1000` |
| `size` | array | `size=M,L` |
| `color` | array | `color=red,blue` |
| `fabric` | array | `fabric=silk,cotton` |
| `sort` | enum | `sort=price_asc` |
| `page` | number | `page=2` |

---

## Responsive Behavior

| Element | Mobile | Desktop |
|---------|--------|---------|
| Filters | Drawer (slide-out) | Sidebar (fixed left) |
| Sort | Bottom sheet or dropdown | Dropdown |
| Grid | 2 columns | 4 columns |
| Product card | Compact (no quick add) | Full (with quick add) |
| Pagination | Simple (prev/next) | Full (page numbers) |

---

## Data Requirements

| Data | Source | Notes |
|------|--------|-------|
| Products | Product entity | With images, variants, pricing |
| Categories | Category entity | Hierarchical structure |
| Filter options | Derived from products | Dynamic (only show available options) |
| Product count | Aggregation | Total and per-filter counts |

---

## Performance Requirements

- Initial load: < 2s
- Filter application: < 500ms
- Image lazy loading: Below-the-fold images
- Skeleton loaders: During data fetch
- URL updates: Push state without page reload

---

## SEO Requirements

**Category Pages:**
- Title: "Buy [Category] Online | BunBunClothing"
- Meta: "Shop [Category] at BunBunClothing. [Count] products available. Free shipping over ₹999."
- H1: Category name
- Canonical: Base category URL (without filters)

**Search Pages:**
- Title: "Search: [Query] | BunBunClothing"
- Meta: noindex (optional, to avoid thin content)

---

## Success Metrics

- Products per session: > 5
- Filter usage rate: > 30%
- Add to cart from catalog: > 8%
- Search-to-product click rate: > 40%
- Page load time: < 2s
