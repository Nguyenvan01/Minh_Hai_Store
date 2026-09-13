const { Pool, types } = require('pg')

// Postgres tra COUNT(*) kieu bigint -> pg doc thanh CHUOI, con mysql2 tra ve SO.
// Doc lai thanh so de code cu (pagination, thong ke) chay dung nhu truoc.
types.setTypeParser(20, (v) => (v === null ? null : parseInt(v, 10)))

// Supabase Transaction Pooler (cong 6543) khi chay tren Vercel.
// O may ca nhan co the dung Postgres localhost binh thuong.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '')
    ? false
    : { rejectUnauthorized: false },
  max: Number(process.env.DB_POOL_MAX || 5),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
})

pool.on('error', (err) => {
  console.error('[db] Loi ket noi nhan roi:', err.message)
})

/**
 * MySQL dung dau ?  —  Postgres dung $1, $2, $3...
 * Bo qua dau ? nam ben trong chuoi ' ... '.
 */
function toPg(sql) {
  let out = ''
  let n = 0
  let inString = false

  for (let i = 0; i < sql.length; i++) {
    const c = sql[i]

    if (c === "'") {
      // '' la dau nhay thoat ben trong chuoi, khong doi trang thai
      if (inString && sql[i + 1] === "'") {
        out += "''"
        i++
        continue
      }
      inString = !inString
      out += c
      continue
    }

    if (c === '?' && !inString) {
      out += '$' + ++n
      continue
    }

    out += c
  }

  return out
}

/**
 * Tra ket qua dung hinh dang ma mysql2 van tra ve, de 192 cau truy van
 * trong controllers khong phai sua gi.
 *   SELECT  ->  [rows, fields]
 *   INSERT  ->  [{ insertId, affectedRows }]
 *   UPDATE  ->  [{ affectedRows, changedRows }]
 */
async function run(client, sql, params = []) {
  const head = sql.trim().slice(0, 12).toLowerCase()
  const isInsert = head.startsWith('insert')
  const isWrite = isInsert || head.startsWith('update') || head.startsWith('delete')

  let text = toPg(sql)

  // mysql2 cho result.insertId; Postgres phai xin bang RETURNING
  if (isInsert && !/\breturning\b/i.test(text)) {
    text = text.replace(/;\s*$/, '') + ' RETURNING id'
  }

  let res
  try {
    res = await client.query(text, params)
  } catch (err) {
    // Bang khong co cot id -> chay lai, bo RETURNING
    if (isInsert && err.code === '42703' && / RETURNING id$/.test(text)) {
      res = await client.query(text.replace(/ RETURNING id$/, ''), params)
      return [{ insertId: undefined, affectedRows: res.rowCount }, []]
    }
    err.sql = text
    throw err
  }

  if (isInsert) {
    return [{
      insertId: res.rows[0] ? res.rows[0].id : undefined,
      affectedRows: res.rowCount,
    }, []]
  }

  if (isWrite) {
    return [{ affectedRows: res.rowCount, changedRows: res.rowCount }, []]
  }

  return [res.rows, res.fields]
}

const db = {
  query: (sql, params) => run(pool, sql, params),
  execute: (sql, params) => run(pool, sql, params),

  // Cho cac khoi transaction trong customerController va adminController
  async getConnection() {
    const client = await pool.connect()
    let released = false

    return {
      query: (sql, params) => run(client, sql, params),
      execute: (sql, params) => run(client, sql, params),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => {
        if (!released) {
          released = true
          client.release()
        }
      },
    }
  },

  end: () => pool.end(),
}

module.exports = db
