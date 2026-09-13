-- =====================================================
-- CLOTHING STORE - Schema cho PostgreSQL / Supabase
-- Sinh tu database/schema.sql (MySQL) bang convert_schema.py
-- =====================================================

-- =====================================================
-- CLOTHING STORE - Database Schema
-- E-commerce Platform for Fashion & Clothing
-- Complete Store Management System
-- =====================================================
--
-- =====================================================
-- TABLE: warehouses
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: suppliers
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    tax_code VARCHAR(50) DEFAULT NULL,
    contact_person VARCHAR(100) DEFAULT NULL,
    bank_account VARCHAR(50) DEFAULT NULL,
    bank_name VARCHAR(100) DEFAULT NULL,
    debt_limit DECIMAL(15, 2) DEFAULT 0.00,
    total_debt DECIMAL(15, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    avatar VARCHAR(500) DEFAULT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager', 'staff')),
    gender TEXT DEFAULT NULL CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE DEFAULT NULL,
    member_level VARCHAR(20) DEFAULT 'Bronze',
    id_card VARCHAR(20) DEFAULT NULL,
    default_city VARCHAR(100) DEFAULT NULL,
    default_district VARCHAR(100) DEFAULT NULL,
    default_ward VARCHAR(100) DEFAULT NULL,
    default_address TEXT DEFAULT NULL,
    reward_points INT DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0.00,
    order_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: employees
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    id_card VARCHAR(20) DEFAULT NULL,
    birth_date DATE DEFAULT NULL,
    gender TEXT DEFAULT NULL CHECK (gender IN ('male', 'female', 'other')),
    address TEXT DEFAULT NULL,
    position VARCHAR(100) DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    hire_date DATE DEFAULT NULL,
    salary DECIMAL(12, 2) DEFAULT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    website VARCHAR(255) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
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
    group_name VARCHAR(50) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: colors
-- =====================================================
CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) DEFAULT NULL,
    hex_code VARCHAR(7) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: products
-- NOTE: image is stored in product_images table, NOT in products.image_url
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
    barcode VARCHAR(100) DEFAULT NULL,
    stock INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    category_id INT DEFAULT NULL,
    brand_id INT DEFAULT NULL,
    gender TEXT DEFAULT 'unisex' CHECK (gender IN ('male', 'female', 'unisex', 'kids_boy', 'kids_girl')),
    age_group TEXT DEFAULT 'adult' CHECK (age_group IN ('adult', 'teen', 'kids', 'all')),
    material VARCHAR(100) DEFAULT NULL,
    pattern VARCHAR(100) DEFAULT NULL,
    season VARCHAR(50) DEFAULT NULL,
    origin VARCHAR(100) DEFAULT NULL,
    total_sold INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
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
-- NOTE: All product images are stored here, NOT in products.image_url
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_thumbnail BOOLEAN DEFAULT FALSE,
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
    barcode VARCHAR(100) DEFAULT NULL,
    price_modifier DECIMAL(12, 2) DEFAULT 0.00,
    price DECIMAL(12, 2) DEFAULT NULL,
    cost_price DECIMAL(12, 2) DEFAULT NULL,
    stock INT DEFAULT 0,
    reserved_stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE SET NULL,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT DEFAULT NULL,
    invoice_number VARCHAR(50) DEFAULT NULL,
    tax_code VARCHAR(50) DEFAULT NULL,
    company_name VARCHAR(255) DEFAULT NULL,
    company_address TEXT DEFAULT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_id_card VARCHAR(20) DEFAULT NULL,
    shipping_full_address TEXT NOT NULL,
    shipping_city VARCHAR(100) DEFAULT NULL,
    shipping_district VARCHAR(100) DEFAULT NULL,
    shipping_ward VARCHAR(100) DEFAULT NULL,
    shipping_address TEXT NOT NULL,
    shipping_note TEXT DEFAULT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    discount_code VARCHAR(50) DEFAULT NULL,
    discount_description VARCHAR(255) DEFAULT NULL,
    points_discount DECIMAL(12, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    total_price DECIMAL(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay', 'cash', 'credit_card')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded', 'failed')),
    payment_id VARCHAR(255) DEFAULT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0.00,
    paid_at TIMESTAMPTZ DEFAULT NULL,
    shipping_method VARCHAR(100) DEFAULT NULL,
    tracking_number VARCHAR(100) DEFAULT NULL,
    shipped_at TIMESTAMPTZ DEFAULT NULL,
    delivered_at TIMESTAMPTZ DEFAULT NULL,
    assigned_employee_id INT DEFAULT NULL,
    customer_note TEXT DEFAULT NULL,
    admin_note TEXT DEFAULT NULL,
    internal_note TEXT DEFAULT NULL,
    points_earned INT DEFAULT 0,
    points_used INT DEFAULT 0,
    refund_amount DECIMAL(12, 2) DEFAULT 0.00,
    refund_reason TEXT DEFAULT NULL,
    refunded_at TIMESTAMPTZ DEFAULT NULL,
    confirmed_at TIMESTAMPTZ DEFAULT NULL,
    cancelled_at TIMESTAMPTZ DEFAULT NULL,
    cancel_reason VARCHAR(500) DEFAULT NULL,
    cancel_by INT DEFAULT NULL,
    recipient_name VARCHAR(100) DEFAULT NULL,
    recipient_phone VARCHAR(20) DEFAULT NULL,
    ward VARCHAR(100) DEFAULT NULL,
    district VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    note TEXT DEFAULT NULL,
    coupon_code VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL
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
    pros TEXT DEFAULT NULL,
    cons TEXT DEFAULT NULL,
    size_rating TEXT DEFAULT 'fit' CHECK (size_rating IN ('too_small', 'small', 'fit', 'large', 'too_large')),
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
-- TABLE: order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT DEFAULT NULL,
    variant_id INT DEFAULT NULL,
    supplier_id INT DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) DEFAULT NULL,
    product_image VARCHAR(500) DEFAULT NULL,
    variant_name VARCHAR(100) DEFAULT NULL,
    size_name VARCHAR(20) DEFAULT NULL,
    color_name VARCHAR(50) DEFAULT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    cost_price DECIMAL(12, 2) DEFAULT NULL,
    quantity INT NOT NULL DEFAULT 1,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    total_price DECIMAL(12, 2) NOT NULL,
    quantity_ordered INT DEFAULT 1,
    quantity_shipped INT DEFAULT 0,
    quantity_delivered INT DEFAULT 0,
    refund_quantity INT DEFAULT 0,
    refund_amount DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
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
    CONSTRAINT unique_cart_item UNIQUE (user_id, product_id, variant_id),
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
    CONSTRAINT unique_wishlist_item UNIQUE (user_id, product_id)
);

-- =====================================================
-- TABLE: coupons
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    coupon_type TEXT DEFAULT 'general' CHECK (coupon_type IN ('general', 'first_order', 'specific_product', 'specific_category', 'shipping', 'points')),
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'percentage_product', 'fixed_product')),
    discount_value DECIMAL(12, 2) NOT NULL,
    max_discount_amount DECIMAL(12, 2) DEFAULT NULL,
    min_order_amount DECIMAL(12, 2) DEFAULT 0.00,
    min_quantity INT DEFAULT NULL,
    max_usage_total INT DEFAULT NULL,
    max_usage_per_user INT DEFAULT 1,
    max_usage_per_day INT DEFAULT NULL,
    applicable_products JSONB DEFAULT NULL,
    applicable_categories JSONB DEFAULT NULL,
    applicable_users JSONB DEFAULT NULL,
    exclude_products JSONB DEFAULT NULL,
    points_required INT DEFAULT NULL,
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    is_single_use BOOLEAN DEFAULT FALSE,
    used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: coupon_usage
-- =====================================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_coupon_order UNIQUE (coupon_id, order_id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: promotions
-- =====================================================
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    banner VARCHAR(500) DEFAULT NULL,
    banner_url VARCHAR(500) DEFAULT NULL,
    promotion_type TEXT DEFAULT 'flash_sale' CHECK (promotion_type IN ('flash_sale', 'buy_x_get_y', 'bundle', 'tier_discount', 'free_shipping', 'gift', 'points_boost')),
    discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount', 'price')),
    discount_value DECIMAL(12, 2) DEFAULT NULL,
    max_discount_amount DECIMAL(12, 2) DEFAULT NULL,
    buy_quantity INT DEFAULT NULL,
    get_quantity INT DEFAULT NULL,
    get_product_id INT DEFAULT NULL,
    get_discount_percent DECIMAL(5, 2) DEFAULT 100.00,
    bundle_product_ids JSONB DEFAULT NULL,
    bundle_price DECIMAL(12, 2) DEFAULT NULL,
    tier_rules JSONB DEFAULT NULL,
    min_order_amount DECIMAL(12, 2) DEFAULT 0.00,
    applicable_products JSONB DEFAULT NULL,
    applicable_categories JSONB DEFAULT NULL,
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMPTZ DEFAULT NULL,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    max_per_user INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (get_product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: reward_points
-- =====================================================
CREATE TABLE IF NOT EXISTS reward_points (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    points INT NOT NULL,
    points_type TEXT NOT NULL CHECK (points_type IN ('earn', 'redeem', 'expire', 'refund', 'bonus', 'adjustment')),
    balance_after DECIMAL(10, 2) DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    order_id INT DEFAULT NULL,
    reference_id INT DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: stock_movements
-- =====================================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    variant_id INT DEFAULT NULL,
    warehouse_id INT DEFAULT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('import', 'export', 'transfer_in', 'transfer_out', 'adjustment', 'return_in', 'return_out', 'damage', 'gift', 'sample')),
    quantity INT NOT NULL,
    quantity_before INT DEFAULT NULL,
    quantity_after INT DEFAULT NULL,
    unit_cost DECIMAL(12, 2) DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    reference_id INT DEFAULT NULL,
    supplier_id INT DEFAULT NULL,
    employee_id INT DEFAULT NULL,
    reason VARCHAR(500) DEFAULT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INT DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: return_requests
-- =====================================================
CREATE TABLE IF NOT EXISTS return_requests (
    id SERIAL PRIMARY KEY,
    request_code VARCHAR(50) NOT NULL UNIQUE,
    order_id INT NOT NULL,
    order_item_id INT DEFAULT NULL,
    user_id INT NOT NULL,
    reason_type TEXT NOT NULL CHECK (reason_type IN ('wrong_item', 'defective', 'not_as_described', 'size_issue', 'changed_mind', 'late_delivery', 'other')),
    reason_description TEXT DEFAULT NULL,
    request_type TEXT DEFAULT 'return' CHECK (request_type IN ('return', 'exchange', 'refund')),
    requested_quantity INT DEFAULT 1,
    exchange_product_id INT DEFAULT NULL,
    exchange_variant_id INT DEFAULT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'received', 'processing', 'completed', 'cancelled')),
    admin_note TEXT DEFAULT NULL,
    processed_by INT DEFAULT NULL,
    processed_at TIMESTAMPTZ DEFAULT NULL,
    refund_amount DECIMAL(12, 2) DEFAULT 0.00,
    points_refund INT DEFAULT 0,
    new_order_id INT DEFAULT NULL,
    images JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (exchange_product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (exchange_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: news
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
-- TABLE: contacts
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    contact_type TEXT DEFAULT 'general' CHECK (contact_type IN ('general', 'complaint', 'suggestion', 'partnership', 'warranty', 'recruitment')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'replied', 'resolved', 'closed', 'archived')),
    assigned_to INT DEFAULT NULL,
    admin_reply TEXT DEFAULT NULL,
    replied_at TIMESTAMPTZ DEFAULT NULL,
    is_replied BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'email', 'social', 'in_person', 'other')),
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: settings
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
    group_name VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255) DEFAULT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: shipping_providers
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    logo VARCHAR(500) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    tracking_url VARCHAR(500) DEFAULT NULL,
    api_key VARCHAR(255) DEFAULT NULL,
    api_secret VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: shipping_zones
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cities JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: shipping_fees
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_fees (
    id SERIAL PRIMARY KEY,
    provider_id INT NOT NULL,
    zone_id INT NOT NULL,
    min_weight DECIMAL(10, 2) DEFAULT 0.00,
    max_weight DECIMAL(10, 2) DEFAULT 5.00,
    base_fee DECIMAL(12, 2) NOT NULL,
    fee_per_kg DECIMAL(12, 2) DEFAULT 0.00,
    estimated_days_min INT DEFAULT 1,
    estimated_days_max INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (provider_id) REFERENCES shipping_providers(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES shipping_zones(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: payment_methods
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    icon VARCHAR(255) DEFAULT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    config JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: supplier_orders
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    warehouse_id INT DEFAULT NULL,
    employee_id INT DEFAULT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'ordered', 'partial_received', 'received', 'cancelled')),
    order_date DATE DEFAULT NULL,
    expected_date DATE DEFAULT NULL,
    received_date DATE DEFAULT NULL,
    subtotal DECIMAL(15, 2) DEFAULT 0.00,
    discount_amount DECIMAL(15, 2) DEFAULT 0.00,
    tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
    payment_due_date DATE DEFAULT NULL,
    note TEXT DEFAULT NULL,
    internal_note TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: supplier_order_items
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_order_items (
    id SERIAL PRIMARY KEY,
    supplier_order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT DEFAULT NULL,
    size_id INT DEFAULT NULL,
    color_id INT DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) DEFAULT NULL,
    variant_name VARCHAR(100) DEFAULT NULL,
    quantity_ordered INT NOT NULL DEFAULT 0,
    quantity_received INT DEFAULT 0,
    quantity_remaining INT DEFAULT 0,
    unit_cost DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    total_cost DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_order_id) REFERENCES supplier_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE SET NULL,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: expense_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    parent_id INT DEFAULT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES expense_categories(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: expenses
-- =====================================================
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    expense_code VARCHAR(50) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    warehouse_id INT DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'other')),
    supplier_id INT DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    reference_id INT DEFAULT NULL,
    employee_id INT DEFAULT NULL,
    approved_by INT DEFAULT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    note TEXT DEFAULT NULL,
    receipt_image VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
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
-- TABLE: activity_logs
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) DEFAULT NULL,
    entity_id INT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    changes JSONB DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    device_info VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INDEXES (Postgres khong cho khai bao trong CREATE TABLE)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses (code);
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses (is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers (code);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers (is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees (employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_user ON employees (user_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees (is_active);
CREATE INDEX IF NOT EXISTS idx_user_default ON addresses (user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_user ON addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories (sort_order);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands (slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands (is_active);
CREATE INDEX IF NOT EXISTS idx_sizes_sort ON sizes (sort_order);
CREATE INDEX IF NOT EXISTS idx_sizes_group ON sizes (group_name);
CREATE INDEX IF NOT EXISTS idx_colors_sort ON colors (sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products (gender);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_total_sold ON products (total_sold);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,'')));
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_images_sort ON product_images (product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants (sku);
CREATE INDEX IF NOT EXISTS idx_variants_size ON product_variants (size_id);
CREATE INDEX IF NOT EXISTS idx_variants_color ON product_variants (color_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_assigned ON orders (assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews (rating);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews (is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON product_reviews (is_active);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON order_items (variant_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON cart_items (product_id);
CREATE INDEX IF NOT EXISTS idx_cart_variant ON cart_items (variant_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlists (product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupons_valid ON coupons (valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons (is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage (user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage (coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON coupon_usage (order_id);
CREATE INDEX IF NOT EXISTS idx_promotions_slug ON promotions (slug);
CREATE INDEX IF NOT EXISTS idx_promotions_type ON promotions (promotion_type);
CREATE INDEX IF NOT EXISTS idx_promotions_valid ON promotions (valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions (is_active);
CREATE INDEX IF NOT EXISTS idx_points_user ON reward_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_type ON reward_points (points_type);
CREATE INDEX IF NOT EXISTS idx_points_order ON reward_points (order_id);
CREATE INDEX IF NOT EXISTS idx_points_expires ON reward_points (expires_at);
CREATE INDEX IF NOT EXISTS idx_stock_product ON stock_movements (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_variant ON stock_movements (variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse ON stock_movements (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_type ON stock_movements (movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_reference ON stock_movements (reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_created ON stock_movements (created_at);
CREATE INDEX IF NOT EXISTS idx_returns_code ON return_requests (request_code);
CREATE INDEX IF NOT EXISTS idx_returns_order ON return_requests (order_id);
CREATE INDEX IF NOT EXISTS idx_returns_user ON return_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON return_requests (status);
CREATE INDEX IF NOT EXISTS idx_returns_reason ON return_requests (reason_type);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news (slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news (category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news (is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news (is_featured);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts (contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_priority ON contacts (priority);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts (created_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings (setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_group ON settings (group_name);
CREATE INDEX IF NOT EXISTS idx_providers_code ON shipping_providers (code);
CREATE INDEX IF NOT EXISTS idx_providers_active ON shipping_providers (is_active);
CREATE INDEX IF NOT EXISTS idx_fees_provider ON shipping_fees (provider_id);
CREATE INDEX IF NOT EXISTS idx_fees_zone ON shipping_fees (zone_id);
CREATE INDEX IF NOT EXISTS idx_payment_code ON payment_methods (code);
CREATE INDEX IF NOT EXISTS idx_payment_active ON payment_methods (is_active);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_code ON supplier_orders (order_code);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier ON supplier_orders (supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON supplier_orders (status);
CREATE INDEX IF NOT EXISTS idx_supplier_items_order ON supplier_order_items (supplier_order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_items_product ON supplier_order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_expense_categories_code ON expense_categories (code);
CREATE INDEX IF NOT EXISTS idx_expenses_code ON expenses (expense_code);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses (status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (created_at);
CREATE INDEX IF NOT EXISTS idx_logs_user ON activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON activity_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs (created_at);

-- =====================================================
-- Tu dong cap nhat updated_at (MySQL lam san, Postgres phai dung trigger)
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
    SELECT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables tb
      ON tb.table_name = c.table_name AND tb.table_schema = c.table_schema
    WHERE c.table_schema = 'public'
      AND c.column_name = 'updated_at'
      AND tb.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated ON %I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON %I
                    FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t, t);
  END LOOP;
END $$;
