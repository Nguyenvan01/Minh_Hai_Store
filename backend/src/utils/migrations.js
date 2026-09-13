// KHONG CON DUOC SU DUNG.
// Toan bo DDL trong file nay la cu phap MySQL (INT AUTO_INCREMENT, ENGINE=InnoDB,
// bat ma loi ER_DUP_FIELDNAME...) nen khong chay duoc tren PostgreSQL.
// Cac bang va cot truoc day file nay tao nay da nam trong database/schema.pg.sql.
// Giu lai de tham chieu lich su; khong require file nay o bat ky dau.

const db = require('../config/database')

async function addColumnIfNotExists(table, column, definition) {
  try {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
    console.log(`[Migration] ✓ Added column ${table}.${column}`)
    return true
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log(`[Migration] ${table}.${column} already exists, skipping`)
      return false
    }
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      console.log(`[Migration] ${table}.${column} already exists, skipping`)
      return false
    }
    throw err
  }
}

async function runMigrations() {
  console.log('[Migration] Running database migrations...')

  try {
    // Addresses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(255) NOT NULL,
        ward VARCHAR(100) DEFAULT '',
        district VARCHAR(100) DEFAULT '',
        city VARCHAR(100) NOT NULL,
        is_default TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_default (user_id, is_default),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ addresses table ready')
  } catch (err) {
    if (err.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('[Migration] addresses table already exists')
    } else {
      console.error('[Migration] Error creating addresses table:', err.message)
    }
  }

  try {
    // Wishlists table
    await db.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user (user_id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ wishlists table ready')
  } catch (err) {
    if (err.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('[Migration] wishlists table already exists')
    } else {
      console.error('[Migration] Error creating wishlists table:', err.message)
    }
  }

  // Users member_level column
  try {
    await addColumnIfNotExists('users', 'member_level', "VARCHAR(20) DEFAULT 'Bronze'")
  } catch (err) {
    console.error(`[Migration] Error adding users.member_level:`, err.message)
  }

  // --- Orders table schema migration ---
  // Add missing columns to orders table if they don't exist
  const orderColumns = [
    { name: 'recipient_name',   def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'recipient_phone',  def: 'VARCHAR(20) DEFAULT \'\'' },
    { name: 'ward',            def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'district',        def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'city',            def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'address_detail',  def: 'TEXT' },
    { name: 'shipping_ward_name',     def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'shipping_district_name', def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'shipping_city_name',     def: 'VARCHAR(100) DEFAULT \'\'' },
    { name: 'shipping_method', def: 'VARCHAR(50) DEFAULT \'standard\'' },
    { name: 'note',            def: 'TEXT' },
    { name: 'coupon_code',     def: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'cancel_reason',   def: 'TEXT' },
    { name: 'cancelled_at',    def: 'DATETIME DEFAULT NULL' },
    { name: 'delivered_at',     def: 'DATETIME DEFAULT NULL' },
  ]

  for (const col of orderColumns) {
    try {
      await addColumnIfNotExists('orders', col.name, col.def)
    } catch (err) {
      console.error(`[Migration] Error adding orders.${col.name}:`, err.message)
    }
  }

  try {
    await addColumnIfNotExists('contacts', 'is_replied', 'TINYINT(1) DEFAULT 0')
  } catch (err) {
    console.error('[Migration] Error adding contacts.is_replied:', err.message)
  }

  try {
    await addColumnIfNotExists('settings', 'setting_type', "ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string'")
  } catch (err) {
    console.error('[Migration] Error adding settings.setting_type:', err.message)
  }

  try {
    await addColumnIfNotExists('settings', 'group_name', "VARCHAR(50) DEFAULT 'general'")
  } catch (err) {
    console.error('[Migration] Error adding settings.group_name:', err.message)
  }

  // Product reviews is_active column
  try {
    await addColumnIfNotExists('product_reviews', 'is_active', 'TINYINT(1) DEFAULT 1')
  } catch (err) {
    console.error('[Migration] Error adding product_reviews.is_active:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        discount_type ENUM('percentage', 'fixed_amount') NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(12, 2) NOT NULL,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        is_featured TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_promotions_slug (slug),
        INDEX idx_promotions_active_dates (is_active, start_date, end_date),
        INDEX idx_promotions_featured (is_featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ promotions table ready')
  } catch (err) {
    console.error('[Migration] Error creating promotions table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        email VARCHAR(150) DEFAULT NULL,
        address VARCHAR(255) DEFAULT NULL,
        contact_person VARCHAR(100) DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_suppliers_active (is_active),
        INDEX idx_suppliers_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ suppliers table ready')
  } catch (err) {
    console.error('[Migration] Error creating suppliers table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS warehouses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        address VARCHAR(255) DEFAULT NULL,
        is_main TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_warehouses_active (is_active),
        INDEX idx_warehouses_main (is_main)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ warehouses table ready')
  } catch (err) {
    console.error('[Migration] Error creating warehouses table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS import_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
        payment_method ENUM('cash', 'bank_transfer') DEFAULT 'cash',
        status ENUM('draft', 'processing', 'partial_received', 'received', 'cancelled') DEFAULT 'processing',
        note TEXT DEFAULT NULL,
        created_by INT DEFAULT NULL,
        received_at DATETIME DEFAULT NULL,
        cancelled_at DATETIME DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_import_orders_code (code),
        INDEX idx_import_orders_status (status),
        INDEX idx_import_orders_supplier (supplier_id),
        INDEX idx_import_orders_dates (order_date, expected_date),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ import_orders table ready')
  } catch (err) {
    console.error('[Migration] Error creating import_orders table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS import_order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_import_items_order (import_order_id),
        INDEX idx_import_items_product (product_id),
        INDEX idx_import_items_variant (variant_id),
        FOREIGN KEY (import_order_id) REFERENCES import_orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ import_order_items table ready')
  } catch (err) {
    console.error('[Migration] Error creating import_order_items table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        variant_id INT DEFAULT NULL,
        type ENUM('import', 'export', 'adjustment', 'sale', 'return') NOT NULL,
        quantity INT NOT NULL,
        before_stock INT NOT NULL DEFAULT 0,
        after_stock INT NOT NULL DEFAULT 0,
        reference_type VARCHAR(50) DEFAULT NULL,
        reference_id INT DEFAULT NULL,
        note TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_inventory_product (product_id),
        INDEX idx_inventory_variant (variant_id),
        INDEX idx_inventory_reference (reference_type, reference_id),
        INDEX idx_inventory_type (type),
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('[Migration] ✓ inventory_transactions table ready')
  } catch (err) {
    console.error('[Migration] Error creating inventory_transactions table:', err.message)
  }

  try {
    await db.query(`
      INSERT IGNORE INTO suppliers (code, name, phone, email, address, contact_person)
      VALUES ('SUP-DEFAULT', 'Nhà cung cấp mặc định', '0900000000', 'supplier@example.com', 'Hà Nội', 'Bộ phận cung ứng')
    `)
    await db.query(`
      INSERT IGNORE INTO warehouses (code, name, address, is_main, is_active)
      VALUES ('WH-MAIN', 'Kho chính', 'Kho trung tâm', 1, 1)
    `)
    console.log('[Migration] ✓ default supplier and warehouse ready')
  } catch (err) {
    console.error('[Migration] Error seeding supplier/warehouse:', err.message)
  }

  console.log('[Migration] Done.')
}

module.exports = { runMigrations }
