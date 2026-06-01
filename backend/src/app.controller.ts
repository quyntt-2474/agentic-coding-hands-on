import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Lightweight liveness endpoint used by the keep-alive ping (Render free tier).
  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }
}
