# Architecture

## Database Schema (Prisma)
Key models and their relationships:

```
User ──┬── Session (Lucia auth sessions)
       ├── Address (shipping addresses)
       ├── Cart ── CartItem ──┬── Product
       │                      └── ProductVariant
       ├── Order ──┬── OrderItem
       │           └── OrderStatusHistory
       ├── Wishlist ── WishlistItem ── Product
       └── Review

Product ──┬── ProductImage
          ├── ProductVariant (SKU, size, color, price, stock)
          └── Category

Coupon (standalone — referenced by code in Order)
Banner (standalone — homepage hero banners)
```

### Key Fields
- `User.role`: `'customer'` | `'admin'` — controls access to `/admin/*`
- `User.passwordHash`: bcrypt hash (cost 10)
- `ProductVariant.salePrice`: nullable — if set, shown as discounted price
- `Order.shippingAddress`: JSON string (snapshot of address at order time)
- `Order.paymentMethod`: `'cod'` | `'razorpay'`
- `Order.razorpayOrderId` / `razorpayPaymentId`: for future Razorpay integration

## Authentication Flow
1. **Register**: `POST /register` → validate → bcrypt hash → create User → Lucia session → redirect
2. **Login**: `POST /login` → find user by email → bcrypt compare → Lucia session → redirect
3. **Session**: `hooks.server.ts` validates session cookie on every request via `lucia.validateSession()`
4. **Admin**: Layout guard at `/admin/+layout.server.ts` checks `role === 'admin'`
5. **Logout**: Delete Lucia session + clear cookie

## API Patterns

### Form Actions (SvelteKit)
Used for: login, register, checkout, admin CRUD
- Protected by CSRF automatically
- Use `use:enhance` for progressive enhancement
- All admin actions include role verification

### REST API Endpoints
Used for: cart operations, image upload, health check, wishlist
- `/api/cart` — GET/POST/PATCH/DELETE (auth required for mutations)
- `/api/upload` — POST (admin-only, uploads to Cloudinary)
- `/api/health` — GET (public: ok/error, admin: full diagnostics)

## Checkout Flow
1. User adds items to cart via `/api/cart` POST
2. User navigates to `/checkout` — loads addresses, cart, available coupons
3. User selects address, payment method, optional coupon
4. `placeOrder` action:
   - Recalculates coupon discount server-side (never trusts client)
   - Verifies address belongs to user
   - Creates Order + OrderItems in a transaction
   - Decrements stock
   - Clears cart
   - Redirects to `/order-confirmation/[id]`

## Image Upload Flow
1. Admin selects file(s) on product/banner form
2. Frontend sends `FormData` to `/api/upload`
3. Server validates: admin auth, file type (jpg/png/webp/avif), size (<5MB)
4. Converts to base64 data URI
5. Uploads to Cloudinary (`bunbun_products` or `bunbun_banners` folder)
6. Returns `secure_url` — stored in database as ProductImage or Banner record

## Pricing Logic
- `ProductVariant.price` — base price in INR
- `ProductVariant.salePrice` — optional discounted price
- Display price = `salePrice ?? price`
- Shipping: free if subtotal ≥ ₹999, else ₹79
- Coupon: percentage (with optional maxDiscount cap) or flat amount
- Total = `max(subtotal + shipping - couponDiscount, 0)`
