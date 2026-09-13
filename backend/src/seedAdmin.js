require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')

async function seed() {
  // Connect to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clothing_store',
    charset: 'utf8mb4',
  })

  const email = 'admin@clothing-store.vn'
  const plainPassword = 'Admin@123456'
  const name = 'Quản trị viên'

  // Generate bcrypt hash
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds)

  console.log('Generated hash:', passwordHash)

  // Check if admin already exists
  const [existing] = await connection.query(
    'SELECT id, email, password, role FROM users WHERE email = ?',
    [email]
  )

  if (existing.length > 0) {
    const user = existing[0]
    console.log(`Found existing user: ${user.email}, role: ${user.role}`)
    console.log(`Current password field: ${user.password ? (user.password.length > 20 ? 'hashed' : 'plain') : 'null/empty'}`)

    // Update password to bcrypt hash
    await connection.query(
      `UPDATE users SET password = ?, name = ?, role = 'admin' WHERE email = ?`,
      [passwordHash, name, email]
    )
    console.log('Updated password and role for existing admin account.')
  } else {
    // Insert new admin account
    await connection.query(
      `INSERT INTO users (email, password, name, role, created_at, updated_at)
       VALUES (?, ?, ?, 'admin', NOW(), NOW())`,
      [email, passwordHash, name]
    )
    console.log('Created new admin account.')
  }

  // Verify
  const [verify] = await connection.query(
    'SELECT id, email, name, role FROM users WHERE email = ?',
    [email]
  )
  console.log('\nAdmin account in database:')
  console.log(verify[0])

  // Test bcrypt compare
  const testMatch = await bcrypt.compare(plainPassword, verify[0].password)
  console.log(`\nPassword match test: ${testMatch ? 'PASSED' : 'FAILED'}`)

  await connection.end()
  console.log('\nDone.')
}

seed().catch(err => {
  console.error('Seed error:', err.message)
  process.exit(1)
})
