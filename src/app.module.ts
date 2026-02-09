import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './db/postgres.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 🔥 MOST IMPORTANT
        }),
        PostgresModule,
        IngestionModule,
        AnalyticsModule,
        HealthModule,
    ],
})
export class AppModule { }
