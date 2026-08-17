const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = 3001

// PostgreSQL connection
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'manufacturing',
  password: 'admin123',
  port: 5432,
})

// Middleware
app.use(cors())
app.use(express.json())

// Get machines from PostgreSQL
app.get('/api/machines', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        status,
        temperature,
        vibration,
        efficiency
      FROM machines
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)

    res.status(500).json({
      error: 'Unable to retrieve machine data',
    })
  }
})

// Get production data from PostgreSQL
app.get('/api/production', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        time_label AS time,
        output
      FROM production_data
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)

    res.status(500).json({
      error: 'Unable to retrieve production data',
    })
  }
})

// Get alerts from PostgreSQL
app.get('/api/alerts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        message,
        severity
      FROM alerts
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Database error:', error)

    res.status(500).json({
      error: 'Unable to retrieve alert data',
    })
  }
})

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')

    res.json({
      status: 'ok',
      message: 'Manufacturing API and PostgreSQL are running',
      database: 'connected',
    })
  } catch (error) {
    console.error('Database health check failed:', error)

    res.status(500).json({
      status: 'error',
      message: 'PostgreSQL connection failed',
      database: 'disconnected',
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})