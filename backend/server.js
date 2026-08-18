require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

const PORT = process.env.PORT || 3001

// -------------------------
// PostgreSQL Connection
// -------------------------

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// -------------------------
// Middleware
// -------------------------

app.use(cors())
app.use(express.json())

// -------------------------
// Root Route
// -------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'Manufacturing Operations API',
    status: 'running',
  })
})

// -------------------------
// Machine API - PostgreSQL
// -------------------------

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

    const machines = result.rows.map((machine) => ({
      ...machine,
      temperature:
        machine.temperature !== null
          ? Number(machine.temperature)
          : null,
      vibration:
        machine.vibration !== null
          ? Number(machine.vibration)
          : null,
      efficiency: Number(machine.efficiency),
    }))

    res.json(machines)
  } catch (error) {
    console.error('Machines database error:', error)

    res.status(500).json({
      error: 'Unable to load machine data',
    })
  }
})

// -------------------------
// Production API - PostgreSQL
// -------------------------

app.get('/api/production', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        time_label,
        output
      FROM production_data
      ORDER BY id
    `)

    const productionData = result.rows.map((row) => ({
      time: row.time_label,
      output: Number(row.output),
    }))

    res.json(productionData)
  } catch (error) {
    console.error('Production database error:', error)

    res.status(500).json({
      error: 'Unable to load production data',
    })
  }
})

// -------------------------
// Alerts API - PostgreSQL
// -------------------------

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
    console.error('Alerts database error:', error)

    res.status(500).json({
      error: 'Unable to load alerts',
    })
  }
})

// -------------------------
// Health API
// -------------------------

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')

    res.json({
      status: 'ok',
      message: 'Manufacturing API is running',
      database: 'connected',
    })
  } catch (error) {
    console.error('Database health check failed:', error)

    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
    })
  }
})

// -------------------------
// Start Server
// -------------------------

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`)
})