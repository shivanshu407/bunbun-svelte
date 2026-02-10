# Section: Shopping Cart

**Section ID:** `cart`  
**Route:** `/cart`  
**Priority:** 🔴 Critical (Build First)

---

## Overview

The shopping cart allows customers to review, modify, and manage items before checkout. It must clearly show pricing, enable quantity changes, and provide a seamless path to checkout.

---

## User Stories

- View all items added to cart
- Update quantities or remove items
- See itemized pricing with GST
- Apply coupon codes for discounts
- Continue shopping or proceed to checkout
- Cart persists across sessions

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🛒 YOUR CART (3 items)                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ ┌─────┐                                                         │    │
│  │ │ IMG │  Red Silk Patola Saree                         🗑️       │    │
│  │ │     │  Size: Free Size | Color: Red                          │    │
│  │ └─────┘  ₹899 (was ₹1,999)          [-] 1 [+]      = ₹899      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ ┌─────┐                                                         │    │
│  │ │ IMG │  Cotton Blouse - White                         🗑️       │    │
│  │ │     │  Size: M | Color: White                                │    │
│  │ └─────┘  ₹499                       [-] 2 [+]      = ₹998      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
├────────────────────────────────┬────────────────────────────────────────┤
│  🎟️ HAVE A COUPON?             │         ORDER SUMMARY                  │
│  [Enter code______] [APPLY]   │                                        │
│                                │         Subtotal (3 items)    ₹1,897  │
│  ✅ BUNBUN10 applied (-₹190)  │         Discount (BUNBUN10)    -₹190   │
│                                │         Shipping               FREE   │
│  ─────────────────────────────│         GST (18%)               ₹307   │
│                                │         ─────────────────────────     │
│  🚚 Free shipping on ₹999+    │         TOTAL                 ₹2,014   │
│                                │                                        │
│  [← CONTINUE SHOPPING]        │         [PROCEED TO CHECKOUT →]        │
└────────────────────────────────┴────────────────────────────────────────┘
```

---

## Components

### 1. Cart Header
- Title: "Your Cart"
- Item count badge
- Empty cart link to clear all

### 2. Cart Item Card
| Element | Description |
|---------|-------------|
| Image | Product thumbnail (100x120px) |
| Name | Product title (linked to PDP) |
| Variant | Size, color details |
| Unit Price | Sale price (show original if discounted) |
| Quantity | +/- buttons with input |
| Line Total | Unit price × quantity |
| Remove | Trash icon to delete item |

### 3. Coupon Section
- Input field for coupon code
- Apply button
- Success: Show discount applied with ✅
- Error: "Invalid code" or "Expired"
- Multiple coupons: Show if allowed

### 4. Order Summary
| Line | Calculation |
|------|-------------|
| Subtotal | Sum of line totals |
| Discount | Coupon/promo reduction |
| Shipping | FREE above ₹999, else ₹49 |
| GST | 18% on (subtotal - discount) |
| **Total** | Final amount |

### 5. Action Buttons
- **Continue Shopping** → `/collections`
- **Proceed to Checkout** → `/checkout`

---

## Empty Cart State

```
┌─────────────────────────────────────────┐
│           🛒                            │
│                                         │
│     Your cart is empty                  │
│                                         │
│     Looks like you haven't added        │
│     anything to your cart yet.          │
│                                         │
│     [START SHOPPING]                    │
└─────────────────────────────────────────┘
```

---

## Cart Persistence

| User State | Storage |
|------------|---------|
| Guest | localStorage |
| Logged In | Database (synced) |
| Login during checkout | Merge guest cart with user cart |

---

## Validation & Limits

| Rule | Behavior |
|------|----------|
| Min quantity | 1 |
| Max quantity | 10 or stock available |
| Out of stock | Show warning, disable checkout |
| Item removed elsewhere | Show "Item no longer available" |

---

## Mobile Layout

- Single column, stacked cards
- Sticky bottom bar with total + checkout button
- Collapsible order summary

---

## Success Metrics

- Cart abandonment rate: < 70%
- Coupon usage rate: > 15%
- Proceed to checkout rate: > 40%
