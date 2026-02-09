import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { PostgresModule } from '../db/postgres.module';

@Module({
    imports: [PostgresModule],
    controllers: [IngestionController],
    providers: [IngestionService],
})
export class IngestionModule { }
