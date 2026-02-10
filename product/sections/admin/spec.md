# Section: Admin Dashboard

**Section ID:** `admin`  
**Routes:** `/admin/*`  
**Priority:** 🟡 High (Build Second)

---

## Overview

Backend admin panel for managing products, orders, customers, coupons, banners, and viewing reports. Uses sidebar navigation pattern for efficient admin workflows.

---

## Admin Shell

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO] BunBunClothing Admin                    🔔 (3)  👤 Admin ▼ │
├───────────────────┬─────────────────────────────────────────────────┤
│                   │                                                 │
│  📊 Dashboard     │              MAIN CONTENT AREA                  │
│  📦 Products      │                                                 │
│  📁 Categories    │                                                 │
│  🛒 Orders        │                                                 │
│  👥 Customers     │                                                 │
│  🎟️ Coupons       │                                                 │
│  📢 Banners       │                                                 │
│  📈 Reports       │                                                 │
│  ⚙️ Settings      │                                                 │
│                   │                                                 │
└───────────────────┴─────────────────────────────────────────────────┘
```

---

## Pages

### 1. Dashboard (`/admin`)

**Quick Stats Cards:**
| Metric | Icon |
|--------|------|
| Today's Orders | 📦 |
| Today's Revenue | 💰 |
| Pending Orders | ⏳ |
| Low Stock Items | ⚠️ |

**Charts:**
- Revenue (last 7/30 days)
- Orders trend
- Top selling products

**Recent Activity:**
- Latest 5 orders
- Recent customer signups

---

### 2. Products (`/admin/products`)

**List View:**
| Column | Sortable |
|--------|----------|
| Image | No |
| Product Name | Yes |
| SKU | Yes |
| Price | Yes |
| Stock | Yes |
| Status | Yes |
| Actions | No |

**Features:**
- Add new product
- Bulk actions (delete, change status)
- Search & filters
- CSV export/import

**Add/Edit Product Form:**
| Section | Fields |
|---------|--------|
| Basic | Name, slug, description |
| Pricing | Price, sale price, cost |
| Inventory | SKU, stock, track inventory |
| Media | Images (drag & drop), video |
| Variants | Size options, color options |
| Category | Select category/subcategory |
| SEO | Meta title, description |
| Status | Published/Draft |

---

### 3. Categories (`/admin/categories`)

- Hierarchical tree view
- Drag & drop reorder
- Add/Edit/Delete
- Assign products

---

### 4. Orders (`/admin/orders`)

**List View:**
| Column | Data |
|--------|------|
| Order # | #BBC123 |
| Customer | Name, email |
| Date | Feb 9, 2026 |
| Items | 3 items |
| Total | ₹2,014 |
| Payment | Paid/Pending |
| Status | Dropdown to update |
| Actions | View, Invoice |

**Order Detail:**
- Customer info
- Order items
- Shipping address
- Payment details
- Status history
- Update status
- Add notes
- Generate invoice PDF
- Process refund

---

### 5. Customers (`/admin/customers`)

- Customer list with search
- Total orders, lifetime value
- View customer profile
- Order history per customer
- Export customer list

---

### 6. Coupons (`/admin/coupons`)

**Coupon Fields:**
| Field | Type |
|-------|------|
| Code | Text (unique) |
| Type | Percentage / Fixed |
| Value | Number |
| Min Order | Amount |
| Max Discount | Amount |
| Usage Limit | Total / Per user |
| Valid From/To | Date range |
| Status | Active/Inactive |

---

### 7. Banners (`/admin/banners`)

- Homepage banner management
- Desktop & mobile images
- Link URL
- Display order (drag & drop)
- Schedule (start/end date)
- Active/Inactive toggle

---

### 8. Reports (`/admin/reports`)

| Report | Data |
|--------|------|
| Sales Report | Revenue by day/week/month |
| Product Performance | Top sellers, low performers |
| Customer Report | New vs returning |
| Inventory | Stock levels, low stock alerts |
| Coupon Usage | Redemptions, revenue impact |

**Export:** CSV, PDF

---

### 9. Settings (`/admin/settings`)

| Section | Options |
|---------|---------|
| Store | Name, logo, contact |
| Shipping | Rates, free shipping threshold |
| Payments | Razorpay keys |
| Taxes | GST rate |
| Email | SMTP, templates |
| Notifications | SMS settings |

---

## Admin Auth

- Separate login (`/admin/login`)
- Role-based access (Admin, Manager, Staff)
- Session management
- Activity logs

---

## Mobile Admin

- Responsive sidebar (collapsible)
- Essential actions available
- Order management priority

---

## Success Metrics

- Order processing time: < 24 hours
- Inventory accuracy: > 98%
- Admin task completion rate: Track common workflows
