# Section: Checkout & Payments

**Section ID:** `checkout`  
**Routes:** `/checkout`, `/checkout/payment`, `/order-confirmation/:orderId`  
**Priority:** 🔴 Critical (Build First)

---

## Overview

The checkout flow converts cart to order. It collects shipping address, selects payment method, and processes payment via Razorpay. Must be fast, secure, and mobile-optimized.

---

## User Stories

- Enter or select shipping address
- Choose delivery speed
- Apply coupon codes
- Pay via UPI, cards, net banking, or COD
- Receive order confirmation
- Get email/SMS notifications

---

## Checkout Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CART      │ →  │  ADDRESS    │ →  │  PAYMENT    │ →  │ CONFIRMATION│
│             │    │             │    │             │    │             │
│ Review items│    │ Shipping    │    │ Razorpay    │    │ Order placed│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Step 1: Address Selection

```
┌─────────────────────────────────────────────────────────────────────┐
│  📍 SHIPPING ADDRESS                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ ○ Home                      │  │ ○ Office                    │  │
│  │   Priya Sharma              │  │   Priya Sharma              │  │
│  │   123 Main Street           │  │   456 Business Park         │  │
│  │   Mumbai, MH 400001         │  │   Bangalore, KA 560001      │  │
│  │   +91 98765 43210           │  │   +91 98765 43210           │  │
│  │   [EDIT] [DELETE]           │  │   [EDIT] [DELETE]           │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
│  [+ ADD NEW ADDRESS]                                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🚚 DELIVERY OPTIONS                                                │
│                                                                     │
│  ○ Standard Delivery (5-7 days) - FREE                             │
│  ○ Express Delivery (2-3 days) - ₹99                               │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                         [CONTINUE TO PAYMENT →]     │
└─────────────────────────────────────────────────────────────────────┘
```

### Add/Edit Address Form

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Phone | Tel (10 digits) | Yes |
| Pincode | Number (6 digits) | Yes |
| Address Line 1 | Text | Yes |
| Address Line 2 | Text | No |
| City | Text (auto-fill from pincode) | Yes |
| State | Dropdown (auto-fill) | Yes |
| Address Type | Radio (Home/Office/Other) | No |
| Set as Default | Checkbox | No |

---

## Step 2: Payment

```
┌─────────────────────────────────────────────────────────────────────┐
│  💳 PAYMENT                                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ORDER SUMMARY                                                      │
│  ──────────────                                                     │
│  Red Silk Patola Saree × 1              ₹899                       │
│  Cotton Blouse × 2                      ₹998                       │
│  ──────────────                                                     │
│  Subtotal                               ₹1,897                      │
│  Discount (BUNBUN10)                    -₹190                       │
│  Shipping                               FREE                        │
│  GST                                    ₹307                        │
│  ──────────────                                                     │
│  TOTAL                                  ₹2,014                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PAYMENT METHOD                                                      │
│                                                                     │
│  ○ UPI (GPay, PhonePe, Paytm)                                      │
│  ○ Credit / Debit Card                                              │
│  ○ Net Banking                                                      │
│  ○ Wallets (Paytm, Mobikwik)                                       │
│  ○ EMI (No Cost EMI available)                                     │
│  ○ Cash on Delivery (+₹49 handling fee)                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│              [PAY ₹2,014 →]                                         │
│                                                                     │
│  🔒 Secured by Razorpay                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Razorpay Integration

| Feature | Implementation |
|---------|----------------|
| SDK | Razorpay Checkout.js |
| Methods | UPI, Cards, NetBanking, Wallets, EMI |
| Webhooks | Payment success/failure callbacks |
| Order creation | Create Razorpay order before payment |
| Verification | Verify signature on backend |

---

## Step 3: Order Confirmation

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ✅                                         │
│                                                                     │
│           ORDER PLACED SUCCESSFULLY!                                │
│                                                                     │
│           Order ID: #BBC2024020912345                               │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  📧 Confirmation sent to priya@email.com                           │
│  📱 SMS sent to +91 98765 43210                                    │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  DELIVERY DETAILS                                                   │
│  Estimated delivery: Feb 15-17, 2026                               │
│  Shipping to: 123 Main Street, Mumbai 400001                       │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  ORDER SUMMARY                                                      │
│  Red Silk Patola Saree × 1              ₹899                       │
│  Cotton Blouse × 2                      ₹998                       │
│  Total Paid                             ₹2,014                       │
│                                                                     │
│  ───────────────────────────────────────────────────────────────   │
│                                                                     │
│  [TRACK ORDER]          [CONTINUE SHOPPING]                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Payment Failure Handling

| Scenario | Action |
|----------|--------|
| Payment failed | Show retry option, keep cart intact |
| Timeout | Show "Try again" with same order |
| Razorpay error | Display error message, log for debugging |

---

## Guest Checkout

- Allow checkout without account
- Collect email for order updates
- Offer account creation post-purchase

---

## Mobile Optimization

- Single-column layout
- Collapsible order summary
- Large tap targets
- Razorpay mobile-optimized modal

---

## Security

- HTTPS only
- No card data stored (Razorpay handles)
- CSRF protection
- Order verification on backend

---

## Success Metrics

- Checkout completion rate: > 60%
- Payment success rate: > 95%
- Average checkout time: < 3 minutes
