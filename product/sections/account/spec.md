# Section: User Account

**Section ID:** `account`  
**Routes:** `/account`, `/account/orders`, `/account/addresses`, `/account/wishlist`, `/login`, `/register`  
**Priority:** 🟡 High (Build Second)

---

## Overview

User account section for registration, login, profile management, order history, addresses, and wishlist. Enables returning customers to track orders and manage preferences.

---

## Pages

### 1. Login Page (`/login`)

```
┌─────────────────────────────────────────┐
│                                         │
│          [LOGO]                         │
│                                         │
│       Welcome Back!                     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Email or Phone                   │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Password                    👁️   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Forgot Password?]                     │
│                                         │
│  [        LOGIN        ]                │
│                                         │
│  ──────── OR ────────                   │
│                                         │
│  [📱 Login with OTP]                    │
│  [G  Continue with Google]              │
│                                         │
│  ──────────────────────                 │
│                                         │
│  New here? [Create Account]             │
│                                         │
└─────────────────────────────────────────┘
```

**Auth Methods:**
- Email + Password
- Phone + OTP
- Google OAuth (optional)

---

### 2. Register Page (`/register`)

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Email | Email | Yes |
| Phone | Tel (10 digits) | Yes |
| Password | Password (8+ chars) | Yes |
| Confirm Password | Password | Yes |

---

### 3. Account Dashboard (`/account`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  👋 Hello, Priya!                                    [LOGOUT]       │
├───────────────────┬─────────────────────────────────────────────────┤
│                   │                                                 │
│  MENU             │  MY DASHBOARD                                   │
│  ────             │                                                 │
│  ▸ Dashboard      │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│    Orders         │  │ 📦       │ │ ❤️       │ │ 📍       │        │
│    Addresses      │  │ 5 Orders │ │ 12 Items │ │ 2 Saved  │        │
│    Wishlist       │  │          │ │ Wishlist │ │ Addresses│        │
│    Profile        │  └──────────┘ └──────────┘ └──────────┘        │
│    Password       │                                                 │
│                   │  RECENT ORDERS                                  │
│                   │  ───────────────────────────────────────        │
│                   │  #BBC123 • Feb 5 • ₹2,014 • Delivered ✅        │
│                   │  #BBC122 • Jan 28 • ₹899 • In Transit 🚚       │
│                   │                                                 │
│                   │  [VIEW ALL ORDERS →]                            │
└───────────────────┴─────────────────────────────────────────────────┘
```

---

### 4. Order History (`/account/orders`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  📦 MY ORDERS                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Order #BBC2024020912345              Placed: Feb 9, 2026      │  │
│  │                                                               │  │
│  │ ┌─────┐ Red Silk Patola Saree × 1                    ₹899    │  │
│  │ │ IMG │ Size: Free | Color: Red                              │  │
│  │ └─────┘                                                       │  │
│  │                                                               │  │
│  │ Status: Shipped 🚚                    [TRACK ORDER]          │  │
│  │ Delivery: Feb 12-14                                          │  │
│  │                                                               │  │
│  │ [VIEW DETAILS] [NEED HELP?]                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Order Statuses:**
| Status | Icon | Description |
|--------|------|-------------|
| Pending | ⏳ | Payment confirmation pending |
| Confirmed | ✅ | Order confirmed |
| Processing | 📦 | Being packed |
| Shipped | 🚚 | In transit |
| Delivered | ✅ | Delivered |
| Cancelled | ❌ | Order cancelled |
| Returned | 🔄 | Return processed |

---

### 5. Order Detail (`/account/orders/:orderId`)

- Full order summary
- Item details with images
- Shipping address
- Payment method used
- Tracking timeline
- Invoice download
- Return/Exchange request button

---

### 6. Saved Addresses (`/account/addresses`)

- List all saved addresses
- Add new address
- Edit/Delete existing
- Set default address

---

### 7. Wishlist (`/account/wishlist`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ❤️ MY WISHLIST (12 items)                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                   │
│  │     │ │     │ │     │ │     │                                   │
│  │ IMG │ │ IMG │ │ IMG │ │ IMG │                                   │
│  │     │ │     │ │     │ │     │                                   │
│  └─────┘ └─────┘ └─────┘ └─────┘                                   │
│  Product  Product  Product  Product                                 │
│  ₹899    ₹1,299   ₹799    OUT OF                                   │
│  [ADD]   [ADD]    [ADD]   STOCK                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Move to cart
- Remove from wishlist
- Out of stock indicator
- Share wishlist (optional)

---

### 8. Profile Settings (`/account/profile`)

| Field | Editable |
|-------|----------|
| Name | Yes |
| Email | Yes (with verification) |
| Phone | Yes (with OTP) |
| Profile Picture | Optional |

---

### 9. Change Password (`/account/password`)

- Current password
- New password (with strength meter)
- Confirm new password

---

## Mobile Layout

- Bottom navigation or hamburger menu
- Full-width cards
- Collapsible sidebar → top tabs

---

## Success Metrics

- Account creation rate: > 20% of purchasers
- Repeat purchase rate: > 25%
- Wishlist to cart conversion: > 15%
