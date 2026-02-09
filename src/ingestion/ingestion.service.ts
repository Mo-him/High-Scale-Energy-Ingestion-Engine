import { Injectable } from '@nestjs/common';
import { PostgresService } from '../db/postgres.service';

@Injectable()
export class IngestionService {
    constructor(private db: PostgresService) { }

    async ingestVehicle(d: any) {
        await this.db.query(
            `INSERT INTO vehicle_telemetry
       (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1,$2,$3,$4,$5)`,
            [d.vehicleId, d.soc, d.kwhDeliveredDc, d.batteryTemp, d.timestamp],
        );

        await this.db.query(
            `INSERT INTO vehicle_live_state
       (vehicle_id, soc, last_kwh_delivered_dc, avg_battery_temp, updated_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (vehicle_id)
       DO UPDATE SET
         soc=EXCLUDED.soc,
         last_kwh_delivered_dc=EXCLUDED.last_kwh_delivered_dc,
         avg_battery_temp=EXCLUDED.avg_battery_temp,
         updated_at=NOW()`,
            [d.vehicleId, d.soc, d.kwhDeliveredDc, d.batteryTemp],
        );

        return { status: 'vehicle ingested' };
    }

    async ingestMeter(d: any) {
        await this.db.query(
            `INSERT INTO meter_telemetry
       (meter_id, kwh_consumed_ac, voltage, timestamp)
       VALUES ($1,$2,$3,$4)`,
            [d.meterId, d.kwhConsumedAc, d.voltage, d.timestamp],
        );

        await this.db.query(
            `INSERT INTO meter_live_state
       (meter_id, last_kwh_consumed_ac, voltage, updated_at)
       VALUES ($1,$2,$3,NOW())
       ON CONFLICT (meter_id)
       DO UPDATE SET
         last_kwh_consumed_ac=EXCLUDED.last_kwh_consumed_ac,
         voltage=EXCLUDED.voltage,
         updated_at=NOW()`,
            [d.meterId, d.kwhConsumedAc, d.voltage],
        );

        return { status: 'meter ingested' };
    }
}
