-- =====================================================
-- CLOTHING STORE - Database Schema
-- =====================================================
-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    avatar VARCHAR(500) DEFAULT NULL,
    role VARCHAR(30) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager', 'staff', 'warehouse')),
    gender VARCHAR(30) DEFAULT NULL CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE DEFAULT NULL,
    reward_points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: addresses
-- =====================================================
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    ward VARCHAR(100) DEFAULT '',
    district VARCHAR(100) DEFAULT '',
    city VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: brands
-- =====================================================
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo VARCHAR(500) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: sizes
-- =====================================================
CREATE TABLE IF NOT EXISTS sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    code VARCHAR(10) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: colors
-- =====================================================
CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) DEFAULT NULL,
    hex_code VARCHAR(7) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: products
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(500) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(12, 2) NOT NULL,
    compare_price DECIMAL(12, 2) DEFAULT NULL,
    cost_price DECIMAL(12, 2) DEFAULT NULL,
    sku VARCHAR(100) UNIQUE,
    stock INT DEFAULT 0,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    category_id INT DEFAULT NULL,
    brand_id INT DEFAULT NULL,
    gender VARCHAR(30) DEFAULT 'unisex' CHECK (gender IN ('male', 'female', 'unisex', 'kids_boy', 'kids_girl')),
    material VARCHAR(100) DEFAULT NULL,
    is_online_exclusive BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255) DEFAULT NULL,
    seo_description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: product_images
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_online_exclusive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: product_variants
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    size_id INT DEFAULT NULL,
    color_id INT DEFAULT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(12, 2) DEFAULT NULL,
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE SET NULL,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: suppliers
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    email VARCHAR(150) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    contact_person VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: warehouses
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: import_orders
-- =====================================================
CREATE TABLE IF NOT EXISTS import_orders (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    order_date DATE NOT NULL,
    expected_date DATE DEFAULT NULL,
    total_quantity INT DEFAULT 0,
    subtotal DECIMAL(12, 2) DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    paid_amount DECIMAL(12, 2) DEFAULT 0.00,
    payment_status VARCHAR(30) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
    payment_method VARCHAR(30) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer')),
    status VARCHAR(30) DEFAULT 'processing' CHECK (status IN ('draft', 'processing', 'partial_received', 'received', 'cancelled')),
    note TEXT DEFAULT NULL,
    created_by INT DEFAULT NULL,
    received_at TIMESTAMPTZ DEFAULT NULL,
    cancelled_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: import_order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS import_order_items (
    id SERIAL PRIMARY KEY,
    import_order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT DEFAULT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(150) DEFAULT NULL,
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_cost DECIMAL(12, 2) DEFAULT 0.00,
    total_cost DECIMAL(12, 2) DEFAULT 0.00,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_order_id) REFERENCES import_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: inventory_transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    variant_id INT DEFAULT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('import', 'export', 'adjustment', 'sale', 'return')),
    quantity INT NOT NULL,
    before_stock INT NOT NULL DEFAULT 0,
    after_stock INT NOT NULL DEFAULT 0,
    reference_type VARCHAR(50) DEFAULT NULL,
    reference_id INT DEFAULT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: best_sellers
-- =====================================================
CREATE TABLE IF NOT EXISTS best_sellers (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: collections
-- =====================================================
CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    cta VARCHAR(255) DEFAULT NULL,
    cta_text VARCHAR(100) DEFAULT 'Khám phá',
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: banners
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) DEFAULT NULL,
    slug VARCHAR(200) DEFAULT NULL,
    image VARCHAR(500) NOT NULL,
    link_url VARCHAR(500) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: promotions
-- =====================================================
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    discount_type VARCHAR(30) NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(12, 2) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: vouchers
-- =====================================================
CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    discount_type VARCHAR(30) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_amount DECIMAL(12, 2) DEFAULT 0.00,
    max_usage_total INT DEFAULT NULL,
    max_usage_per_user INT DEFAULT 1,
    applicable_products JSONB DEFAULT NULL,
    applicable_categories JSONB DEFAULT NULL,
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: cart_items
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) DEFAULT NULL,
    user_id INT DEFAULT NULL,
    product_id INT NOT NULL,
    variant_id INT DEFAULT NULL,
    quantity INT NOT NULL DEFAULT 1,
    is_selected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: wishlists
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT DEFAULT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) DEFAULT NULL,
    shipping_district VARCHAR(100) DEFAULT NULL,
    shipping_ward VARCHAR(100) DEFAULT NULL,
    address_detail TEXT DEFAULT NULL,
    shipping_city_name VARCHAR(100) DEFAULT NULL,
    shipping_district_name VARCHAR(100) DEFAULT NULL,
    shipping_ward_name VARCHAR(100) DEFAULT NULL,
    shipping_method VARCHAR(50) DEFAULT 'standard',
    shipping_note TEXT DEFAULT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    discount_code VARCHAR(50) DEFAULT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay', 'cash')),
    payment_status VARCHAR(30) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded')),
    payment_id VARCHAR(255) DEFAULT NULL,
    paid_at TIMESTAMPTZ DEFAULT NULL,
    tracking_number VARCHAR(100) DEFAULT NULL,
    shipped_at TIMESTAMPTZ DEFAULT NULL,
    delivered_at TIMESTAMPTZ DEFAULT NULL,
    points_discount DECIMAL(12, 2) DEFAULT 0.00,
    points_earned INT DEFAULT 0,
    refund_amount DECIMAL(12, 2) DEFAULT 0.00,
    refunded_at TIMESTAMPTZ DEFAULT NULL,
    confirmed_at TIMESTAMPTZ DEFAULT NULL,
    cancelled_at TIMESTAMPTZ DEFAULT NULL,
    cancel_reason VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT DEFAULT NULL,
    variant_id INT DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) DEFAULT NULL,
    product_image VARCHAR(500) DEFAULT NULL,
    size_name VARCHAR(20) DEFAULT NULL,
    color_name VARCHAR(50) DEFAULT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: product_reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT DEFAULT NULL,
    rating SMALLINT NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    content TEXT DEFAULT NULL,
    images JSONB DEFAULT NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_reply TEXT DEFAULT NULL,
    replied_at TIMESTAMPTZ DEFAULT NULL,
    helpful_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: news (Blog)
-- =====================================================
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary VARCHAR(500) DEFAULT NULL,
    content TEXT DEFAULT NULL,
    thumbnail VARCHAR(500) DEFAULT NULL,
    author_id INT DEFAULT NULL,
    author_name VARCHAR(100) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    tags JSONB DEFAULT NULL,
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NULL,
    seo_title VARCHAR(255) DEFAULT NULL,
    seo_description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: newsletter
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMPTZ DEFAULT NULL
);

-- =====================================================
-- TABLE: coupon_usage
-- =====================================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id SERIAL PRIMARY KEY,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: reward_points
-- =====================================================
CREATE TABLE IF NOT EXISTS reward_points (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    points INT NOT NULL,
    points_type VARCHAR(30) NOT NULL CHECK (points_type IN ('earn', 'redeem', 'expire', 'refund', 'bonus', 'adjustment')),
    balance_after INT DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    order_id INT DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT NULL,
    link VARCHAR(500) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: settings
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    setting_type VARCHAR(30) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    group_name VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: contacts
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
    admin_reply TEXT DEFAULT NULL,
    replied_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_user_address ON addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories (sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories (is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands (slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands (is_active);
CREATE INDEX IF NOT EXISTS idx_sizes_sort ON sizes (sort_order);
CREATE INDEX IF NOT EXISTS idx_colors_sort ON colors (sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products (gender);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products (is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_sold ON products (total_sold);
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_images_sort ON product_images (product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants (sku);
CREATE INDEX IF NOT EXISTS idx_variants_size ON product_variants (size_id);
CREATE INDEX IF NOT EXISTS idx_variants_color ON product_variants (color_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers (is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers (name);
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses (is_active);
CREATE INDEX IF NOT EXISTS idx_warehouses_main ON warehouses (is_main);
CREATE INDEX IF NOT EXISTS idx_import_orders_code ON import_orders (code);
CREATE INDEX IF NOT EXISTS idx_import_orders_status ON import_orders (status);
CREATE INDEX IF NOT EXISTS idx_import_orders_supplier ON import_orders (supplier_id);
CREATE INDEX IF NOT EXISTS idx_import_orders_dates ON import_orders (order_date, expected_date);
CREATE INDEX IF NOT EXISTS idx_import_items_order ON import_order_items (import_order_id);
CREATE INDEX IF NOT EXISTS idx_import_items_product ON import_order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_import_items_variant ON import_order_items (variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_transactions (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON inventory_transactions (variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_reference ON inventory_transactions (reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory_transactions (type);
CREATE UNIQUE INDEX IF NOT EXISTS unique_best_seller ON best_sellers (product_id);
CREATE INDEX IF NOT EXISTS idx_bestsellers_sort ON best_sellers (sort_order);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections (slug);
CREATE INDEX IF NOT EXISTS idx_collections_sort ON collections (sort_order);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON collections (is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_banners_sort ON banners (sort_order);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners (is_active, valid_from, valid_until);
CREATE UNIQUE INDEX IF NOT EXISTS unique_promotions_slug ON promotions (slug);
CREATE INDEX IF NOT EXISTS idx_promotions_active_dates ON promotions (is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_featured ON promotions (is_featured);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers (code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers (is_active, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON cart_items (product_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_wishlist_item ON wishlists (user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews (is_approved);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news (slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news (category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news (is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news (is_featured);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter (email);
CREATE UNIQUE INDEX IF NOT EXISTS unique_voucher_order ON coupon_usage (voucher_id, order_id);
CREATE INDEX IF NOT EXISTS idx_points_user ON reward_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_type ON reward_points (points_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings (setting_key);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);

-- =====================================================
-- COT BO SUNG
-- Truoc day do backend/src/utils/migrations.js tao luc khoi dong server.
-- Tren Vercel khong chay migration nen phai khai bao san o day.
-- =====================================================
ALTER TABLE users           ADD COLUMN IF NOT EXISTS member_level VARCHAR(20) DEFAULT 'Bronze';
ALTER TABLE contacts        ADD COLUMN IF NOT EXISTS is_replied   BOOLEAN DEFAULT FALSE;
ALTER TABLE settings        ADD COLUMN IF NOT EXISTS setting_type VARCHAR(20) DEFAULT 'string';
ALTER TABLE settings        ADD COLUMN IF NOT EXISTS group_name   VARCHAR(50) DEFAULT 'general';
ALTER TABLE product_reviews ADD COLUMN IF NOT EXISTS is_active    BOOLEAN DEFAULT TRUE;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_name  VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(20)  DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ward            VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS district        VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city            VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS note            TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code     VARCHAR(50);

-- =====================================================
-- TRIGGER updated_at
-- MySQL co ON UPDATE CURRENT_TIMESTAMP, Postgres thi khong.
-- =====================================================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'updated_at'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated BEFORE UPDATE ON %I '
      'FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t, t);
  END LOOP;
END $$;
