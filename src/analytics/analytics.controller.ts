import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v1/analytics')
export class AnalyticsController {
    constructor(private service: AnalyticsService) { }

    @Get('performance/:vehicleId')
    get(
        @Param('vehicleId') vehicleId: string,
        @Query('hours') hours?: string,
    ) {
        return this.service.performance(vehicleId, Number(hours) || 24);
    }
}
