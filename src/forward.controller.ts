import { Controller, Get, Post, Put, Patch, Delete, Req, Body, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import axios, { AxiosInstance } from 'axios';

@Controller()
@UseGuards(ThrottlerGuard)
export class ForwardController {
  private httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.httpClient = axios.create({ timeout: 30000 });
  }

  private getServiceUrl(path: string): string | undefined {
    const segments = path.split('/').filter(Boolean);
    const serviceName = segments[0];

    const services: Record<string, string | undefined> = {
      auth: this.configService.get<string>('services.auth'),
      users: this.configService.get<string>('services.user'),
      properties: this.configService.get<string>('services.property'),
      contracts: this.configService.get<string>('services.contract'),
      payments: this.configService.get<string>('services.payment'),
      notifications: this.configService.get<string>('services.notification'),
    };

    const baseUrl = services[serviceName];
    if (!baseUrl) return undefined;

    const remainingPath = '/' + segments.slice(1).join('/');
    return baseUrl + remainingPath;
  }

  private handleRequest(method: string, path: string, headers: any, body: any) {
    if (path.startsWith('/api/health')) {
      return Promise.resolve({ data: { gateway: { status: 'up' } } });
    }

    const targetUrl = this.getServiceUrl(path);
    if (!targetUrl) {
      throw new Error(`Service not found for path: ${path}`);
    }

    const headersToForward = { ...headers };
    delete headersToForward['host'];
    delete headersToForward['content-length'];

    return this.httpClient.request({
      method,
      url: targetUrl,
      headers: headersToForward,
      data: body,
      validateStatus: () => true,
    });
  }

  @Get('*')
  async forwardGet(@Req() req: any) {
    const response = await this.handleRequest('GET', req.path, req.headers, null);
    return response.data;
  }

  @Post('*')
  async forwardPost(@Req() req: any, @Body() body: any) {
    const response = await this.handleRequest('POST', req.path, req.headers, body);
    return response.data;
  }

  @Put('*')
  async forwardPut(@Req() req: any, @Body() body: any) {
    const response = await this.handleRequest('PUT', req.path, req.headers, body);
    return response.data;
  }

  @Patch('*')
  async forwardPatch(@Req() req: any, @Body() body: any) {
    const response = await this.handleRequest('PATCH', req.path, req.headers, body);
    return response.data;
  }

  @Delete('*')
  async forwardDelete(@Req() req: any) {
    const response = await this.handleRequest('DELETE', req.path, req.headers, null);
    return response.data;
  }
}