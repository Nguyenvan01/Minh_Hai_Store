# CLOTH - E-commerce Clothing Store

Website bán quần áo với ReactJS + Node.js + Express + MySQL

## Cấu trúc Database

Sử dụng database schema có sẵn tại `/database/schema.sql`

### Bảng chính cho trang chủ:

| UI Section | Database Table | Điều kiện |
|------------|---------------|------------|
| Banner/Slider | `promotions` | `banner IS NOT NULL` |
| Categories | `categories` | `is_featured = TRUE` |
| Featured Products | `products` | `is_featured = TRUE` |
| Best Sellers | `products` | `ORDER BY total_sold DESC` |
| Flash Sale | `products` + `promotions` | `promotion_type = 'flash_sale'` |
| Brands | `brands` | `is_featured = TRUE` |
| Reviews | `product_reviews` | `is_approved = TRUE` |
| News/Blog | `news` | `is_published = TRUE` |

## Cài đặt

### 1. Database

```bash
# Import schema
mysql -u root -p < database/schema.sql

# Import seed data (có sẵn sản phẩm, categories, brands...)
mysql -u root -p < database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với MySQL credentials của bạn
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### GET /api/home

Lấy toàn bộ dữ liệu trang chủ.

**Response:**
```json
{
  "success": true,
  "data": {
    "banners": [...],
    "categories": [...],
    "featuredProducts": [...],
    "bestSellers": [...],
    "flashSales": {
      "products": [...],
      "timer": { "hours": 2, "minutes": 45, "seconds": 30 }
    },
    "brands": [...],
    "reviews": [...],
    "news": [...]
  }
}
```

## Database Credentials

Chỉnh sửa file `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clothing_store
```

## Demo Data

Database seed đã có sẵn:
- 20 categories (danh mục)
- 20+ products (sản phẩm)
- 6 brands (thương hiệu)
- 8 users (người dùng)
- Reviews (đánh giá)
- News (tin tức)

## Chạy production

```bash
# Backend
cd backend
npm run build  # nếu có build script
npm start

# Frontend  
cd frontend
npm run build
```

## Database Schema Overview

```
users ─────────────┬── employees
                   ├── orders ──────── order_items
                   │                 └── product_reviews
                   ├── cart_items
                   ├── wishlist
                   ├── reward_points
                   └── notifications

products ─┬── product_images
           ├── product_variants ──┬── sizes
           │                      └── colors
           ├── product_reviews
           ├── promotions ── (applicable_products JSON)
           └── categories ── brands
```

## Features

- [x] Header với navigation & search
- [x] Hero Banner slider
- [x] Category Bento Grid (asymmetric layout)
- [x] Flash Sale với countdown timer
- [x] Product Cards với hover effects
- [x] Best Sellers carousel
- [x] Brand logos section
- [x] Blog/News section
- [x] Newsletter subscription
- [x] Footer với links
- [x] Skeleton loading
- [x] Responsive design
- [x] Lazy loading images
# CLOTH
# Minh_Hai_Store
