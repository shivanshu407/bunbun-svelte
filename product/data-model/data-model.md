# BunBunClothing — Data Model

This document defines the core entities (the "nouns") of the BunBunClothing ecommerce system and their relationships.

> **Note:** This is a conceptual model, not a database schema. The implementation agent will extend with technical details (field types, indexes, etc.) as needed.

---

## Core Entities

### 1. User
A registered customer who can browse, purchase, and manage their account.

**Key Attributes:**
- Name
- Email
- Phone number
- Password (hashed)
- Addresses (multiple)
- Role (customer, admin)
- Created date

**Relationships:**
- Has many **Orders**
- Has many **Addresses**
- Has many **Reviews**
- Has one **Wishlist**
- Has one **Cart**

---

### 2. Product
An individual item available for purchase.

**Key Attributes:**
- Name
- Slug (URL-friendly identifier)
- Description
- Price (original)
- Sale price (discounted)
- SKU
- Images (multiple)
- Sizes available
- Colors available
- Fabric/material
- Care instructions
- Stock quantity
- Is active (published/draft)
- Created date

**Relationships:**
- Belongs to one **Category**
- Has many **Reviews**
- Has many **Variants** (size/color combinations)
- Appears in many **OrderItems**
- Appears in many **CartItems**
- Appears in many **Wishlists**

---

### 3. Category
A product grouping for navigation and filtering.

**Key Attributes:**
- Name
- Slug
- Description
- Image
- Parent category (for subcategories)
- Display order
- Is active

**Relationships:**
- Has many **Products**
- May have one parent **Category**
- May have many child **Categories**

**Examples:**
- Sarees → Silk Sarees, Cotton Sarees, Designer Sarees
- Blouses → Ready-made, Designer, Padded
- Shapewear
- Towels
- Essentials

---

### 4. Cart
A temporary collection of products a user intends to purchase.

**Key Attributes:**
- Session ID (for guest users)
- Created date
- Updated date

**Relationships:**
- Belongs to one **User** (optional, for logged-in users)
- Has many **CartItems**

---

### 5. CartItem
A single product entry within a cart.

**Key Attributes:**
- Quantity
- Selected size
- Selected color
- Added date

**Relationships:**
- Belongs to one **Cart**
- References one **Product**

---

### 6. Order
A completed purchase transaction.

**Key Attributes:**
- Order number (unique)
- Status (pending, confirmed, processing, shipped, delivered, cancelled, returned)
- Subtotal
- Discount amount
- GST amount
- Shipping cost
- Total amount
- Payment method
- Payment status (pending, paid, failed, refunded)
- Razorpay order ID
- Razorpay payment ID
- Shipping address (snapshot)
- Billing address (snapshot)
- Notes
- Created date
- Updated date

**Relationships:**
- Belongs to one **User**
- Has many **OrderItems**
- May have one **Coupon** applied
- Has many **OrderStatusHistory** entries

---

### 7. OrderItem
A single product entry within an order.

**Key Attributes:**
- Quantity
- Size
- Color
- Unit price (at time of purchase)
- Total price

**Relationships:**
- Belongs to one **Order**
- References one **Product**

---

### 8. Address
A shipping or billing address for a user.

**Key Attributes:**
- Full name
- Phone number
- Address line 1
- Address line 2
- City
- State
- Pincode
- Country (default: India)
- Is default
- Address type (shipping, billing)

**Relationships:**
- Belongs to one **User**

---

### 9. Review
A customer review and rating for a product.

**Key Attributes:**
- Rating (1-5 stars)
- Title
- Comment
- Images (optional)
- Is verified purchase
- Is approved
- Created date

**Relationships:**
- Belongs to one **User**
- Belongs to one **Product**

---

### 10. Wishlist
A saved list of products a user wants to purchase later.

**Key Attributes:**
- Created date
- Updated date

**Relationships:**
- Belongs to one **User**
- Has many **Products**

---

### 11. Coupon
A discount code for promotional offers.

**Key Attributes:**
- Code (unique)
- Description
- Discount type (percentage, fixed amount)
- Discount value
- Minimum order amount
- Maximum discount amount
- Usage limit (total)
- Usage limit per user
- Times used
- Valid from date
- Valid until date
- Is active

**Relationships:**
- Applied to many **Orders**

---

### 12. Banner
A promotional banner for the homepage.

**Key Attributes:**
- Title
- Image (desktop)
- Image (mobile)
- Link URL
- Display order
- Is active
- Start date
- End date

**Relationships:**
- None (standalone)

---

### 13. OrderStatusHistory
Tracks status changes for an order.

**Key Attributes:**
- Status
- Changed at
- Changed by (admin user)
- Notes

**Relationships:**
- Belongs to one **Order**

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   Category   │       │    Banner    │
│              │       │              │
│  - name      │       │  - title     │
│  - slug      │       │  - image     │
│  - parent    │       │  - link      │
└──────┬───────┘       └──────────────┘
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐
│   Product    │◄──────│    Review    │
│              │  1:N  │              │
│  - name      │       │  - rating    │
│  - price     │       │  - comment   │
│  - images    │       └───────┬──────┘
└──────┬───────┘               │
       │                       │
       │ N:M (via CartItem,    │
       │     OrderItem,        │
       │     Wishlist)         │
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│     Cart     │       │     User     │
│              │ 1:1   │              │
│  - items     │◄──────│  - name      │
└──────────────┘       │  - email     │
                       │  - phone     │
                       └──────┬───────┘
                              │ 1:N
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌──────────┐    ┌──────────┐    ┌──────────┐
       │  Order   │    │ Address  │    │ Wishlist │
       │          │    │          │    │          │
       │ - items  │    │ - city   │    │ - items  │
       │ - total  │    │ - pin    │    └──────────┘
       └────┬─────┘    └──────────┘
            │ 1:N
            ▼
       ┌──────────┐    ┌──────────┐
       │OrderItem │    │  Coupon  │
       │          │    │          │
       │ - qty    │    │  - code  │
       │ - price  │    │  - value │
       └──────────┘    └──────────┘
```

---

## Summary

| Entity | Description |
|--------|-------------|
| User | Registered customer or admin |
| Product | Item for sale |
| Category | Product grouping |
| Cart | Shopping cart |
| CartItem | Product in cart |
| Order | Completed purchase |
| OrderItem | Product in order |
| Address | User's shipping/billing address |
| Review | Product review & rating |
| Wishlist | Saved products |
| Coupon | Discount code |
| Banner | Homepage promotional banner |
| OrderStatusHistory | Order status tracking |
