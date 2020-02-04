import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { PhotoModule } from './photo/photo.module';
import { Photo } from './photo/photo.entity';
import { TerminusModule, TerminusModuleOptions, TypeOrmHealthIndicator } from "@nestjs/terminus";

const getTerminusOptions = (
  db: TypeOrmHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      // The health check will be available with /health
      url: '/health',
      // All the indicator which will be checked when requesting /health
      healthIndicators: [
        // Set the timeout for a response to 300ms
        async () => db.pingCheck('database', { timeout: 300 })
      ],
    },
  ],
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'test',
      entities: [Photo],
      synchronize: true,
    }),
    TerminusModule.forRootAsync({
      // Inject the TypeOrmHealthIndicator provided by nestjs/terminus
      inject: [TypeOrmHealthIndicator],
      useFactory: db => getTerminusOptions(db),
    }),
    PhotoModule,
  ],
})
export class AppModule {}
