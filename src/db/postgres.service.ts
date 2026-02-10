import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PostgresService.name);
    private pool: Pool;

    async onModuleInit() {
        const connectionString =
            `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
            `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

        this.logger.log('Initializing PostgreSQL connection pool');
        this.logger.log(`Connecting to: ${process.env.DB_HOST}:${process.env.DB_PORT}`); // Fixed: Added backticks

        // this.pool = new Pool({
        //     connectionString,
        //     ssl: { rejectUnauthorized: false },
        //       family: 4,
        //     max: 20,
        //     idleTimeoutMillis: 30000,
        //     connectionTimeoutMillis: 10000,
        // });

        this.pool = new Pool({
  host: process.env.DB_HOST,          // 👈 IMPORTANT
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  family: 4,                          // 👈 NOW IT WORKS
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});


        // Test the connection
        try {
            const client = await this.pool.connect();
            this.logger.log('✅ Database connection established successfully');
            client.release();
        } catch (error) {
            this.logger.error('❌ Failed to connect to database:', error.message);
            throw error;
        }

        // Handle pool errors
        this.pool.on('error', (err) => {
            this.logger.error('Unexpected error on idle client', err);
        });
    }

    async onModuleDestroy() {
        this.logger.log('Closing PostgreSQL connection pool');
        await this.pool.end();
    }

    async query(text: string, params?: any[]): Promise<QueryResult> {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            this.logger.debug(`Query executed in ${duration}ms`); // Fixed: Added backticks
            return result;
        } catch (error) {
            this.logger.error(`Query failed: ${text}`, error.message); // Fixed: Added backticks
            throw error;
        }
    }

    async getClient() {
        return this.pool.connect();
    }
}
