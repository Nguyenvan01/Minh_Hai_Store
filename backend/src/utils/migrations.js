const db = require('../config/database')

// Postgres ho tro san ADD COLUMN IF NOT EXISTS nen khong can bat loi trung cot
async function addColumnIfNotExists(table, column, definition) {
  await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${definition}`)
}

async function runMigrations() {
  console.log('[Migration] Running database migrations...')

  try {
    await db.query(`
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
      )
    `)
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_default ON addresses (user_id, is_default)')
    await db.query('CREATE INDEX IF NOT EXISTS idx_user ON addresses (user_id)')
  } catch (err) {
    console.error('[Migration] Error creating addresses table:', err.message)
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_wishlist_item UNIQUE (user_id, product_id)
      )
    `)
    await db.query('CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists (user_id)')
    await db.query('CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlists (product_id)')
  } catch (err) {
    console.error('[Migration] Error creating wishlists table:', err.message)
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
    { name: 'recipient_name',  def: "VARCHAR(100) DEFAULT ''" },
    { name: 'recipient_phone', def: "VARCHAR(20) DEFAULT ''" },
    { name: 'ward',            def: "VARCHAR(100) DEFAULT ''" },
    { name: 'district',        def: "VARCHAR(100) DEFAULT ''" },
    { name: 'city',            def: "VARCHAR(100) DEFAULT ''" },
    { name: 'note',            def: 'TEXT' },
    { name: 'coupon_code',     def: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'cancel_reason',   def: 'TEXT' },
    { name: 'cancelled_at',    def: 'TIMESTAMPTZ DEFAULT NULL' },
    { name: 'delivered_at',    def: 'TIMESTAMPTZ DEFAULT NULL' },
  ]

  for (const col of orderColumns) {
    try {
      await addColumnIfNotExists('orders', col.name, col.def)
    } catch (err) {
      console.error(`[Migration] Error adding orders.${col.name}:`, err.message)
    }
  }

  try {
    await addColumnIfNotExists('contacts', 'is_replied', 'BOOLEAN DEFAULT FALSE')
  } catch (err) {
    console.error('[Migration] Error adding contacts.is_replied:', err.message)
  }

  // Product reviews is_active column
  try {
    await addColumnIfNotExists('product_reviews', 'is_active', 'BOOLEAN DEFAULT TRUE')
  } catch (err) {
    console.error('[Migration] Error adding product_reviews.is_active:', err.message)
  }

  console.log('[Migration] Done.')
}

module.exports = { runMigrations }
