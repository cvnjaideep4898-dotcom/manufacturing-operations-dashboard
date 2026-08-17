# Manufacturing Operations Analytics Dashboard

A full-stack manufacturing analytics application designed to monitor production performance, equipment health, operational efficiency, and equipment alerts.

The project demonstrates how operational manufacturing data can be stored in PostgreSQL, exposed through REST APIs, and visualized through an interactive React dashboard.

## Features

- Manufacturing KPI monitoring
- Equipment status tracking
- Production output visualization
- Equipment temperature and vibration monitoring
- Operational alert tracking
- Machine status filtering
- Shift selection
- REST API integration
- PostgreSQL-backed operational data
- Responsive analytics dashboard

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- REST APIs
- CORS

### Database
- PostgreSQL
- SQL

### DevOps
- Docker
- Git
- GitHub

## System Architecture

Manufacturing Data
        |
        v
   PostgreSQL
        |
        v
Node.js / Express API
        |
        v
     REST APIs
        |
        v
React + TypeScript
        |
        v
Analytics Dashboard

## API Endpoints

### Health Check

GET /api/health

Verifies that the API and PostgreSQL database are available.

### Equipment Data

GET /api/machines

Returns machine status, temperature, vibration, and efficiency information.

### Production Data

GET /api/production

Returns hourly manufacturing production output.

### Operational Alerts

GET /api/alerts

Returns recent manufacturing alerts and severity levels.

## Database

The PostgreSQL database contains three primary datasets:

### machines

Stores:

- Machine name
- Operating status
- Temperature
- Vibration
- Efficiency

### production_data

Stores:

- Production time
- Production output

### alerts

Stores:

- Alert title
- Alert message
- Severity

## Dashboard

The dashboard provides:

- Production Output KPI
- Equipment Online KPI
- Active Alerts KPI
- Overall Efficiency KPI
- Equipment Status Table
- Production Performance Chart
- Recent Operational Alerts
- Machine Status Filters
- Shift Filters

## Business Use Case

Manufacturing operations teams need visibility into equipment performance and production conditions.

This dashboard provides a centralized analytics interface that allows operations teams to:

- Identify equipment requiring attention
- Monitor production trends
- Track equipment availability
- Review operational alerts
- Analyze equipment efficiency
- Reduce manual operational reporting

## Project Structure

manufacturing-operations-dashboard/
├── src/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── backend/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
├── public/
├── package.json
└── README.md

## Running the Application

### Backend

cd backend
npm install
node server.js

Backend runs on port 3001.

### Frontend

From the project root:

npm install
npm run dev

The frontend runs using the Vite development server.

## Author

Jaideep

## Project Purpose

Built as a portfolio project demonstrating full-stack analytics development, data visualization, SQL/database integration, REST API development, and modern web technologies.