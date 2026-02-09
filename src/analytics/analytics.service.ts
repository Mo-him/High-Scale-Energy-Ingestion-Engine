import { Injectable } from '@nestjs/common';
import { PostgresService } from '../db/postgres.service';
@Injectable()
export class AnalyticsService {
    constructor(private db: PostgresService) { }

    async performance(vehicleId: string, hours = 24) {
        const r = await this.db.query(
            `
      SELECT
        COALESCE(SUM(v.kwh_delivered_dc),0)::float AS dc,
        COALESCE(AVG(v.battery_temp),0)::float AS avg_temp,
        COALESCE(SUM(m.kwh_consumed_ac),0)::float AS ac
      FROM vehicle_telemetry v
      JOIN meter_telemetry m
        ON DATE_TRUNC('minute', v.timestamp)
         = DATE_TRUNC('minute', m.timestamp)
      WHERE v.vehicle_id = $1
        AND v.timestamp >= NOW() - INTERVAL '${hours} hours'
      `,
            [vehicleId],
        );

        const { dc, ac, avg_temp } = r.rows[0];

        const efficiency = ac > 0 ? dc / ac : null;

        return {
            windowHours: hours,
            totalDcDelivered: dc,
            totalAcConsumed: ac,
            efficiency,
            chargingStatus: efficiency !== null && efficiency < 0.85
                ? 'LOW_EFFICIENCY'
                : 'NORMAL',
            avgBatteryTemp: avg_temp,
        };
    }
}
