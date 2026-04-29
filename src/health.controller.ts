import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface ServiceStatus {
  status: 'up' | 'down';
  latency?: number;
  error?: string;
}

@Controller('health')
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get()
  async check() {
    const services = {
      auth: this.configService.get<string>('services.auth'),
      user: this.configService.get<string>('services.user'),
      property: this.configService.get<string>('services.property'),
      contract: this.configService.get<string>('services.contract'),
      payment: this.configService.get<string>('services.payment'),
      notification: this.configService.get<string>('services.notification'),
    };

    const results: Record<string, ServiceStatus> = {};

    for (const [name, url] of Object.entries(services)) {
      if (!url) continue;

      const start = Date.now();
      try {
        await axios.get(`${url}/health`, { timeout: 5000 });
        results[name] = { status: 'up', latency: Date.now() - start };
      } catch (error) {
        results[name] = {
          status: 'down',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return {
      gateway: { status: 'up' },
      services: results,
      timestamp: new Date().toISOString(),
    };
  }
}
