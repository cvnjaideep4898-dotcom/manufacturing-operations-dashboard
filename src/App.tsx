import { useEffect, useState } from 'react'
import './App.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Machine {
  name: string
  status: string
  temperature: number | null
  vibration: number | null
  efficiency: number
}

interface ProductionPoint {
  time: string
  output: number
}

interface Alert {
  id: number
  title: string
  message: string
  severity: string
}

function App() {
  const [shift, setShift] = useState('Day Shift')
  const [statusFilter, setStatusFilter] = useState('All')

  const [machines, setMachines] = useState<Machine[]>([])
  const [productionData, setProductionData] = useState<ProductionPoint[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/machines')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load machine data')
        }

        return response.json()
      })
      .then((data) => {
        setMachines(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching machine data:', error)
        setError('Unable to load equipment data.')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/api/production')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load production data')
        }

        return response.json()
      })
      .then((data) => {
        setProductionData(data)
      })
      .catch((error) => {
        console.error('Error fetching production data:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/api/alerts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load alerts')
        }

        return response.json()
      })
      .then((data) => {
        setAlerts(data)
      })
      .catch((error) => {
        console.error('Error fetching alerts:', error)
      })
  }, [])

  const filteredMachines =
    statusFilter === 'All'
      ? machines
      : machines.filter((machine) => machine.status === statusFilter)

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Manufacturing Analytics</p>

          <h1>Manufacturing Operations Dashboard</h1>

          <p className="subtitle">
            Monitor production performance, equipment status, and operational alerts.
          </p>
        </div>
      </header>

      <section className="filter-bar">

        <div className="filter-group">
          <label htmlFor="shift">Shift</label>

          <select
            id="shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            <option>Day Shift</option>
            <option>Evening Shift</option>
            <option>Night Shift</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Machine Status</label>

          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Running</option>
            <option>Warning</option>
            <option>Offline</option>
          </select>
        </div>

      </section>

      <section className="kpi-grid">

        <div className="kpi-card">
          <p className="kpi-label">Production Output</p>

          <h2>
            {productionData
              .reduce((total, point) => total + point.output, 0)
              .toLocaleString()}
          </h2>

          <span className="kpi-unit">
            units today
          </span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Equipment Online</p>

          <h2>
            {machines.filter(
              (machine) => machine.status !== 'Offline'
            ).length}{' '}
            / {machines.length}
          </h2>

          <span className="kpi-unit">
            machines active
          </span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Active Alerts</p>

          <h2>
            {alerts.length}
          </h2>

          <span className="kpi-unit">
            requires attention
          </span>
        </div>

        <div className="kpi-card">
          <p className="kpi-label">Overall Efficiency</p>

          <h2>
            {machines.length > 0
              ? (
                  machines.reduce(
                    (total, machine) => total + machine.efficiency,
                    0
                  ) / machines.length
                ).toFixed(1)
              : '0.0'}%
          </h2>

          <span className="kpi-unit">
            {shift}
          </span>
        </div>

      </section>

      <section className="table-card">

        <div className="section-header">
          <div>
            <h2>Equipment Status</h2>

            <p>
              Current operating condition of manufacturing equipment.
            </p>
          </div>
        </div>

        {loading && (
          <p>Loading equipment data...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Status</th>
                  <th>Temperature</th>
                  <th>Vibration</th>
                  <th>Efficiency</th>
                </tr>
              </thead>

              <tbody>

                {filteredMachines.map((machine) => (

                  <tr key={machine.name}>

                    <td>
                      {machine.name}
                    </td>

                    <td>
                      <span
                        className={`status ${machine.status.toLowerCase()}`}
                      >
                        {machine.status}
                      </span>
                    </td>

                    <td>
                      {machine.temperature !== null
                        ? `${machine.temperature}°C`
                        : '—'}
                    </td>

                    <td>
                      {machine.vibration !== null
                        ? `${machine.vibration} mm/s`
                        : '—'}
                    </td>

                    <td>
                      {machine.efficiency}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      <section className="chart-card">

        <div className="section-header">
          <h2>Production Performance</h2>

          <p>
            Hourly production output for the {shift.toLowerCase()}.
          </p>
        </div>

        <div className="chart-container">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={productionData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="output"
                stroke="#2563eb"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </section>

      <section className="alerts-card">

        <div className="section-header">
          <h2>Recent Alerts</h2>

          <p>
            Latest equipment conditions requiring attention.
          </p>
        </div>

        <div className="alert-list">

          {alerts.map((alert) => (

            <div className="alert-item" key={alert.id}>

              <div>
                <h3>
                  {alert.title}
                </h3>

                <p>
                  {alert.message}
                </p>
              </div>

              <span
                className={`alert-severity ${
                  alert.severity === 'Critical'
                    ? 'critical'
                    : alert.severity === 'Warning'
                    ? 'warning-level'
                    : 'offline-level'
                }`}
              >
                {alert.severity}
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}

export default App