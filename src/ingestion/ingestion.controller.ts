import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller()
export class IngestionController {
    constructor(private readonly service: IngestionService) { }

    @Post('v1/ingest')
    ingest(@Body() payload: any) {
        if (payload.vehicleId) return this.service.ingestVehicle(payload);
        if (payload.meterId) return this.service.ingestMeter(payload);
        throw new BadRequestException('Invalid payload');
    }
}
