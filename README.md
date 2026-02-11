# BunBunClothing 🐰👗

A modern, full-stack e-commerce platform built for selling ethnic wear (Sarees, Blouses, etc.) with a premium user experience. Built with SvelteKit, Prisma, and Tailwind CSS.

![BunBunClothing Preview](/static/og-image.png)

## 🚀 Features

### 🛍️ Customer Storefront
- **Modern UI/UX**: Responsive, "liquid glass" aesthetic with smooth animations and transitions.
- **Product Catalog**: Browse by categories (Sarees, Silk, Cotton, Shapewear, etc.) with filtering and sorting.
- **Smart Search**: Real-time product search functionality.
- **Product Details**: Rich product pages with image galleries, size/color variants, and related items.
- **Cart & Checkout**: 
  - Persistent cart synced between devices.
  - Coupon code system (percentage & flat discounts).
  - Secure checkout with address management.
  - Razorpay payment gateway integration.
- **User Account**:
  - Secure Authentication (Sign Up/Login).
  - Order History & Tracking.
  - Wishlist functionality.
  - Profile & Address management.

### 🛡️ Admin Dashboard
- **Dashboard Overview**: Sales analytics, recent orders, and key metrics.
- **Product Management**: Full CRUD for products, variants, and image uploads.
- **Order Management**: Process orders, update statuses, and view details.
- **Category Management**: Organize products into hierarchical categories.
- **Marketing**: Manage homepage banners and promotional coupons.
- **Customer Insights**: View customer data and order history.

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2](https://kit.svelte.dev/) (SSR + CSR)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Lucia Auth v3](https://lucia-auth.com/)
- **Icons**: [Lucide Svelte](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) (Frontend/API)
- **VPS**: Hostinger (Database)

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivanshu407/bunbun-svelte.git
   cd bunbun-svelte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

   # Auth
   # Generate a random string for secrets
   AUTH_SECRET="your-super-secret-key"

   # Payments (Razorpay)
   RAZORPAY_KEY_ID="your_key_id"
   RAZORPAY_KEY_SECRET="your_key_secret"
   ```

4. **Database Setup**
   Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
   
   (Optional) Seed the database with dummy data:
   ```bash
   npm run db:seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components (ProductCard, specific Layouts)
│   ├── server/        # Server-only utilities (DB, Auth)
│   ├── stores/        # Svelte stores (Cart, Wishlist, User)
│   └── utils/         # Helper functions
├── routes/
│   ├── (app)/         # Customer-facing routes
│   ├── admin/         # Admin dashboard routes (protected)
│   ├── api/           # API endpoints (Cart, Webhooks)
│   └── +layout.svelte # Root layout
└── prisma/
    └── schema.prisma  # Database schema definition
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
