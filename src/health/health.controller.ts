//import { Controller, Get } from '@nestjs/common';
//import { PostgresService } from '../db/postgres.service';

//@Controller('health')
//export class HealthController {
//    constructor(private readonly db: PostgresService) { }

//    @Get('db')
//    async dbHealth() {
//        const res = await this.db.query(
//            'SELECT current_database(), current_user'
//        );
//        return res.rows[0];
//    }
//}


import { Controller, Get } from '@nestjs/common';
import { PostgresService } from '../db/postgres.service';

@Controller('health')
export class HealthController {
    constructor(private readonly postgresService: PostgresService) { }

    @Get('db')
    async dbHealth() {
        try {
            const result = await this.postgresService.query('SELECT NOW()');
            return {
                status: 'healthy',
                timestamp: result.rows[0].now,
                message: 'Database connection successful'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}