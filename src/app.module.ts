import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ForwardController } from './forward.controller';
import { HealthController } from './health.controller';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [ForwardController, HealthController],
})
export class AppModule {}