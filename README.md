High-Scale Energy Ingestion Engine

A scalable backend system designed to ingest high-frequency energy telemetry data from multiple sources (EVs, meters), store it efficiently in PostgreSQL, and provide real-time and analytical insights through REST APIs.



# Database Design
1️⃣ Vehicle Telemetry (Historical Store)
CREATE TABLE vehicle_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL,
  soc INTEGER,
  kwh_delivered_dc NUMERIC,
  battery_temp NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL
);

2️⃣ Meter Telemetry (Historical Store)
CREATE TABLE meter_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL,
  kwh_consumed_ac NUMERIC,
  voltage NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL
);

Indexing Strategy (Performance)
CREATE INDEX idx_vehicle_time
ON vehicle_telemetry(vehicle_id, timestamp DESC);

CREATE INDEX idx_meter_time
ON meter_telemetry(meter_id, timestamp DESC);


 Optimized for time-window queries
 Avoids full table scans

# Database Connection

PostgreSQL hosted on Supabase

SSL-secured connection

Connection pooling enabled

Environment Variables
DB_HOST=db.exczkuvbvncevhsjyuno.supabase.co
DB_PORT=6543
DB_USER=postgres
DB_PASSWORD=********
DB_NAME=postgres

# Health Check API
Endpoint
GET /health/db

Response
{
  "status": "healthy",
  "timestamp": "2026-02-09T07:05:15.557Z",
  "message": "Database connection successful"
}

# Ingestion API (Polymorphic)
Endpoint
POST /v1/ingest

Vehicle Telemetry Payload
{
  "vehicleId": "11111111-1111-1111-1111-111111111111",
  "soc": 75,
  "kwhDeliveredDc": 10.5,
  "batteryTemp": 36,
  "timestamp": "2026-02-09T10:00:00Z"
}

Meter Telemetry Payload
{
  "meterId": "22222222-2222-2222-2222-222222222222",
  "kwhConsumedAc": 13.2,
  "voltage": 230,
  "timestamp": "2026-02-09T10:00:00Z"
}


 Single endpoint
 Auto-detects payload type
 Write-optimized inserts

# Analytics API
Endpoint
GET /v1/analytics/performance/:vehicleId?hours=24

Sample Response
{
  "totalDcDelivered": "10.5",
  "totalAcConsumed": "13.2",
  "efficiency": 0.7954,
  "avgBatteryTemp": "36.0"
}

Metrics Explained

totalDcDelivered → Total DC energy delivered to battery

totalAcConsumed → Total AC energy consumed from grid

efficiency → DC / AC conversion efficiency

avgBatteryTemp → Average battery temperature

 Time-window based analytics
 Correlated meter + vehicle telemetry
 Optimized SQL joins


# Scalability Considerations

Stateless APIs

Connection pooling

Indexed time-range queries

Can add:

Live (hot) tables

Materialized views

Kafka / Queue for async ingestion


# Testing

APIs tested using Postman

Manual validation for ingestion and analytics

Health endpoint validates DB connectivity

